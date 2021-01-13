import pandas as pd
import os
import cv2
from tqdm import tqdm
import base64
import json
from pymongo import MongoClient 
from bson.json_util import dumps
from os import path
import subprocess
import databaseHandler
from databaseHandler import DatabaseHandler
import shutil
import subprocess


exe = "../exiftool/Image-ExifTool-12.12/exiftool"


class videoPropertyAPI:
    
    
    def __init__(self):
        print("__init__")



    def get_video_metadata(self,v_path):
        process = subprocess.Popen([exe,v_path],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,universal_newlines=True)
        metadata = {}
        for output in process.stdout:
            info = {}
            line = output.strip().split(": ")
            metadata[line[0].strip()] = line[1].strip()
        return metadata



    def saveMetadata(self,v_id, title, description, language, privacysettings, languagemodel, tags, category, deletemarker):
        try:
            for video_id in v_id:
                print(deletemarker)
                videos = video_id.split(",")
                for v in videos:
                    v.strip()
                    selection_criteria = {"v_id":v}
                    update_data = ""
                    if title == None:
                        update_data = {"$set":{"description":description,"language":language,"privacysettings":privacysettings,"languagemodel":languagemodel,"tags":tags,"category":category,"deletemarker":deletemarker}}
                    else:
                        update_data = {"$set":{"title":title,"description":description,"language":language,"privacysettings":privacysettings,"languagemodel":languagemodel,"tags":tags,"category":category,"deletemarker":deletemarker}}            
                    databasehandler = databaseHandler.DatabaseHandler("videometadata", "videometadatacollection")
                    insertstatus, message = databasehandler.updateRecord(selection_criteria, update_data)
            return (0, "Record saved")
        except Exception as e:
            return (-1,e)

    def getTranscript(self, v_id):
        try:
            #check if record exists in db
            databasehandler = databaseHandler.DatabaseHandler("videotranscript", "videotranscriptcollection")
            findrecord =  {'v_id': v_id}
            result, cursor = databasehandler.checkIfExists(findrecord)
            if result == True:
                print("record exists in db")
                #update the views count
                selection_criteria = {"v_id":v_id}
                update_data = {"$inc": {'views': 1}}
                databasehandler = databaseHandler.DatabaseHandler("videotranscript", "videotranscriptcollection")
                insertstatus, message = databasehandler.updateRecord(selection_criteria, update_data)
                result, cursor = databasehandler.checkIfExists(findrecord)
                if result == True:
                    print("update meta data")
                    databasehandler = databaseHandler.DatabaseHandler("videometadata", "videometadatacollection")
                    insertstatus, message = databasehandler.updateRecord(selection_criteria, update_data)
                    return(0,list(cursor))
                else:
                    return(-1, cursor)
            transcript_path = "../output/transcripts/%s" % (v_id)
            if not os.path.exists(transcript_path):
                os.makedirs(transcript_path)
            input_video_path = "../output/videos/file_%s.mp4"%(v_id)
            output_wav_path = "../output/videos/file_%s.wav"%(v_id)            


            p = subprocess.call(['sh', "../speech_text/vid_to_au.sh", input_video_path, output_wav_path])
            transcript_file = "%s/%s.transcript"%(transcript_path, v_id)
            f = open(transcript_file, "w")
            subprocess.call(['sh', "../speech_text/transcript.sh", output_wav_path], stdout=f)
            
            
            files = os.listdir(transcript_path)
            transcript_data = ""
            transcript_found = False	
            for file in files:
                with open(transcript_path+"/"+file, 'r') as file:
                    file_content = file.read()
                    #file_content.strip()
                    #splitted = file_content.split(" ", 1)
                    #print(splitted)
                    try:
                        transcript_data_tmp = "{\"timestamp\":\"%s\", \"transcript\":\"%s\"},"%("01.00.02", file_content)
                        transcript_data = transcript_data + transcript_data_tmp

                        record = {"v_id":v_id,"timestamp":"01.00.02","transcript": file_content, "views":1}
                        databasehandler = databaseHandler.DatabaseHandler("videotranscript", "videotranscriptcollection")
                        insertstatus, message = databasehandler.insertRecord(record)
                        print(insertstatus)
                        transcript_found = True
                    except Exception as e:
                        print(e)    
                file.close()
            if transcript_found == True:
                selection_criteria = {"v_id":v_id}
                update_data = {"$inc": {'views': 1}}
                databasehandler = databaseHandler.DatabaseHandler("videometadata", "videometadatacollection")
                insertstatus, message = databasehandler.updateRecord(selection_criteria, update_data)                
            transcript_data = transcript_data.strip(',')		
            #create record to save to db
            findrecord =  {'v_id': v_id}
            databasehandler = databaseHandler.DatabaseHandler("videotranscript", "videotranscriptcollection")
            result, cursor = databasehandler.checkIfExists(findrecord)
            return (result, list(cursor))
        except Exception as e:
            return (-1, e)
        


    def updateTranscript(self,v_id, timestamp, updated_transcript):
        try:
            selection_criteria = {"v_id":v_id, "timestamp":timestamp}
            update_data = {"$set":{"transcript":updated_transcript}}
            databasehandler = databaseHandler.DatabaseHandler("videotranscript", "videotranscriptcollection")
            insertstatus, message = databasehandler.updateRecord(selection_criteria, update_data)
            #update file on disk
            filename = "../output/transcripts/%s/%s.transcript"%(v_id,v_id)
            with open(filename, 'w') as filetowrite:
                filetowrite.write(updated_transcript)
            return (insertstatus, message) 
        except Exception as e:
            return (-1, e)

    def getAllRecordsInfo(self):
        databasehandler = databaseHandler.DatabaseHandler("videometadata", "videometadatacollection")
        result,recordslist,exception = databasehandler.fetchAllRecords()
        if result == 0:
            return (result, recordslist, exception)
        else:
            return (result, recordslist, exception)

    def getPaginatedRecords(self, page_number, page_size):
        databasehandler = databaseHandler.DatabaseHandler("videometadata", "videometadatacollection")
        result,recordslist,exception = databasehandler.fetchPaginatedRecords(page_number, page_size)
        if result == 0:
            return (result, recordslist, exception)
        else:
            return (result, recordslist, exception)


    def getTotalRecords(self):
        databasehandler = databaseHandler.DatabaseHandler("videometadata", "videometadatacollection")
        result = databasehandler.getTotalRecords()
        return result


    def searchRecord(self, search_by_field, value):
        databasehandler = databaseHandler.DatabaseHandler("videometadata", "videometadatacollection")
        result = databasehandler.searchRecord(search_by_field, value)
        return result

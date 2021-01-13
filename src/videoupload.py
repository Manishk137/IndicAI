import secrets
import string
import databaseHandler
from databaseHandler import DatabaseHandler
import os
import thumbnailGenerator
from thumbnailGenerator import ThumbnailGenerator


class UploadVideos:
    def uploadsinglevideo(self, file):
        try:
            filename = file.filename
            filename = os.path.splitext(filename)[0]
            key = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for i in range(6))
            uploadPath = '../output/videos/file_{}.mp4'.format(key)
            videoabspath = os.path.dirname(os.path.abspath(uploadPath))+"/file_" + key + ".mp4"
            print(videoabspath)
            file.save(uploadPath)
            file.close()
            databasehandler = databaseHandler.DatabaseHandler("videoupload", "videouploadcollection")
            record = {"v_id":key,"v_uploadpath":videoabspath, "title":filename}
            insertstatus, message = databasehandler.insertRecord(record)

            if insertstatus == 0:
                #generate thumbnail and insert metadata to db
                thumbnailgenerator = thumbnailGenerator.ThumbnailGenerator(videoabspath,filename)
                status,key, msg = thumbnailgenerator.generateThumbnail()
                print(key)
                return (status, key, msg)
            else:
                return (insertstatus, key, message)
        except Exception as ex:
            return (-1, "", ex)

            
    def uploadmultiplevideos(self, files):
        try:
            filesList = []
            for file in files:
                if file:
                    filename = file.filename
                    filename = os.path.splitext(filename)[0]
                    key = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for i in range(6))                
                    uploadPath = '../output/videos/file_{}.mp4'.format(key)
                    videoabspath = os.path.dirname(os.path.abspath(uploadPath))+"/file_" + key + ".mp4"
                    file.save(uploadPath)
                    file.close()
                    databasehandler = databaseHandler.DatabaseHandler("videoupload", "videouploadcollection")
                    record = {"v_id":key,"v_uploadpath":videoabspath, "title":filename}
                    insertstatus, message = databasehandler.insertRecord(record)

                    if insertstatus == 0:
                        #generate thumbnail and insert metadata to db
                        thumbnailgenerator = thumbnailGenerator.ThumbnailGenerator(videoabspath,filename)
                        status,key, msg = thumbnailgenerator.generateThumbnail()
                        filesList.append(key)
            return (0, filesList, "")
        except Exception as ex:
            return (-1, "" ,ex)


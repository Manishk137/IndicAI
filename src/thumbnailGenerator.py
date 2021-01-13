import databaseHandler
import cv2
import subprocess
from databaseHandler import DatabaseHandler
import utilities

exe = "../exiftool/Image-ExifTool-12.12/exiftool"

class ThumbnailGenerator:
   def __init__(self, videoPath,filename):
       self.videoPath = videoPath
       self.filename = filename


   def generateThumbnail(self):
       frames = ThumbnailGenerator.video_to_frames(self, self.videoPath)
       innerbreak = False
       print(self.videoPath)
       v_id = self.videoPath.split(".")[0].split("_")[1]
       print("test")
       print(v_id)
       for i in range(len(frames)):
           if innerbreak == True:
               break;
           thumb = ThumbnailGenerator.image_to_thumbs(self, frames[i])
           thumbnail_name=v_id+".png"
           for k, v in thumb.items():
               thumbnail_path = '../output/thumbnails/%s.png' % (v_id)
               cv2.imwrite(thumbnail_path, v)
               innerbreak = True
               break
       metadata = ThumbnailGenerator.get_video_metadata(self,self.videoPath)
       creationDate = metadata['Create Date']
       print(creationDate)
       if creationDate == '0000:00:00 00:00:00':
           creationDate = utilities.getCurrentDate()    
           print(creationDate)        
       numofdays = utilities.getNumberOfDaysFromCurrentDate(creationDate)
       upload_date = utilities.getCurrentDate()
       record = {"v_id":v_id, "title": self.filename,"v_thumbnail":thumbnail_name,"v_thumbnailpath":"/home/nice/videoAnalyticsLatest/thumbnails/%s.png"%(v_id),"File Size":metadata['File Size'],"time":metadata['Duration'],"upload_date":upload_date, "CreatedOn":numofdays,"ModifiedOn":metadata['Modify Date'], "deletemarker":"false","views":0}
       databasehandler = databaseHandler.DatabaseHandler("videometadata", "videometadatacollection")
       insertstatus, message = databasehandler.insertRecord(record)
       return (insertstatus, v_id, message)



   def get_video_metadata(self,v_path):
       process = subprocess.Popen([exe,v_path],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,universal_newlines=True)
       metadata = {}
       for output in process.stdout:
           info = {}
           line = output.strip().split(": ")
           metadata[line[0].strip()] = line[1].strip()
       return metadata



   def video_to_frames(self,video_filename):
       """Extract frames from video"""
       cap = cv2.VideoCapture(video_filename)
       video_length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) - 1
       frames = []
       if cap.isOpened() and video_length > 0:
           frame_ids = [0]
           if video_length >= 4:
               frame_ids = [0,
                            round(video_length * 0.75),
                            video_length - 1]
           count = 0
           success, image = cap.read()
           while success:
               if count in frame_ids:
                   frames.append(image)
                   break
               success, image = cap.read()
               count += 1
       return frames


   def image_to_thumbs(self,img):
       """Create thumbs from image"""
       height, width, channels = img.shape
       thumbs = {"original": img}
       sizes = [640,320,160]
       for size in sizes:
           if (width >= size):
               r = (size + 0.0) / width
               max_size = (size, int(height * r))
               thumbs[str(size)] = cv2.resize(img, max_size, interpolation=cv2.INTER_AREA)
               return thumbs

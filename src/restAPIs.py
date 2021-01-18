from flask import Flask, jsonify
from flask_restful import Resource, Api, reqparse, request
import json
from flask_cors import CORS
import secrets
import string
from flask_mail import Mail
import videoupload
from videoProperties import videoPropertyAPI
from registrationandlogin import RegistrationAndLogin

app = Flask(__name__)
CORS(app)
api = Api(app)

data = ""
with open('mailconfig.josn') as f:
  data = json.load(f)

app.config['MAIL_SERVER'] = data['mail_server']
app.config['MAIL_PORT'] = data['mail_port']
app.config['MAIL_USE_SSL'] = data['mail_use_ssl']
app.config['MAIL_USERNAME'] = data['mail_username']
app.config['MAIL_PASSWORD'] = data['mail_password']
mailserver = Mail(app)

parser = reqparse.RequestParser()

class UploadSingleVideo(Resource):
    def post(self):
        try:
            videouploadobj = videoupload.UploadVideos()
            file = request.files['file']
            if file:
                returnval, key, exception = videouploadobj.uploadsinglevideo(file)
                print("returnval=%s, key=%s, exception=%s"%(returnval,key,exception))
                if returnval == 0: #success
                    return json.dumps(
                    {
                        "message": "file has been saved",
                        "VideoKey": str(key)
                    }
                    ,
                    default=str)
                elif returnval == -1: #exception
                    return json.dumps(
                    {
                        "message": "exception occurred",
                        "exception": str(exception)
                    }
                    ,
                    default=str)
        except Exception as ex:
            print(ex)
            return json.dumps(
                {
                    "message": "exception occured",
                    "exception": str(ex)
                }
                ,
                default=str)
        

class UploadMultipleVideos(Resource):
    def post(self):
        try:
            videouploadobj = videoupload.UploadVideos()
            if 'files[]' not in request.files:
                resp = jsonify({'message': 'No file part in the request'})
                resp.status_code = 400
                return resp
            files = request.files.getlist('files[]')
            returnval, fileslist, exception = videouploadobj.uploadmultiplevideos(files)
            if returnval == 0:
                return json.dumps(
                    {
                        "message":"files have been saved",
                        "VideoKeys":fileslist
                    }
                    ,
                    default=str)
            elif returnval == -1: #exception
                    return json.dumps(
                    {
                        "message": "exception occurred",
                        "exception": str(exception)
                    }
                    ,
                    default=str)
        except Exception as ex:
            return json.dumps(
                {
                    "message": "Exception Occured",
                    "exception": str(ex)
                }
                ,
                default=str)


class UploadModelFiles(Resource):
    def post(self):
        try:
            videouploadobj = videoupload.UploadVideos()
            if 'files[]' not in request.files:
                resp = jsonify({'message': 'No file part in the request'})
                resp.status_code = 400
                return resp
            files = request.files.getlist('files[]')
            returnval, message = videouploadobj.uploadmodelfiles(files)
            return json.dumps(
                    {
                        "message":message
                    }
                    ,
                    default=str)
        except Exception as ex:
            return json.dumps(
                {
                    "message": "Exception Occured",
                    "exception": str(ex)
                }
                ,
                default=str)


class RegisterNewUser(Resource):
    def post(self):
        parser.add_argument('email', type=str)
        parser.add_argument('first', type=str)
        parser.add_argument('last', type=str)
        parser.add_argument('password', type=str)
        parser.add_argument('confirmPassword', type=str)
        
        args = parser.parse_args()

        email = args["email"]
        first_name = args["first"]
        last_name = args["last"]
        password = args["password"]
        confirmPassword = args["confirmPassword"]

        registrationandloginobj = RegistrationAndLogin()
        returval, message = registrationandloginobj.register_new_user(email, first_name, last_name, password, confirmPassword)
        return json.dumps(
            {
                "message": str(message)
            }
            ,
            default=str)


class Login(Resource):
    def post(self):
        parser.add_argument('email', type=str)
        parser.add_argument('password', type=str)

        args = parser.parse_args()
            
        email = args["email"]
        password = args["password"]
        registrationandloginobj = RegistrationAndLogin()    
        checkLoginFlag,email,first_name, message = registrationandloginobj.login(email,password)
        if checkLoginFlag == "YES":
            return json.dumps(
                    {
                       "flag":"YES",
                       "message":str(message),
                       "email":email,
                       "firstName":first_name
                    }
                    ,
                    default=str)
        else:
             return json.dumps(
                    {   
                        "flag":"NO",
                        "message":str(message),
                        "email":email,
                        "firstName":first_name
                    }
                    ,
                    default=str)


class ForgotPasswordRetreive(Resource):
    def post(self):
        parser.add_argument('email', type=str)
        args = parser.parse_args()
        
        email = args["email"]
        registrationandloginobj = RegistrationAndLogin()  
        retreiveDone, error  = registrationandloginobj.forgotpasswordRetreive(app, mailserver, email)
        
        if retreiveDone == "True":
            return json.dumps(
                    {
                     "retreiveDone":"True",
                     "error":"No Error"
                    }
                    ,
                    default=str)
        else :
            return json.dumps(
                    {
                      "retrieveDone" : "False",
                      "error":error        
                            }
                    ,
                    default=str
                    )



class GetInfo(Resource):    
    def post(self):
        parser.add_argument('info', type=str)

        args = parser.parse_args()
        flag = args["info"]
        
        if flag == "YES":
           videoProperty = videoPropertyAPI() 
           result, recordslist, exception = videoProperty.getAllRecordsInfo()
           if result == 0:
               return json.dumps(
                        {
                           "videoProperties":recordslist,
                        }
                        ,
                        default=str)
           else:
               return json.dumps(
                        {
                           "videoProperties":exception
                        }
                        ,
                        default=str)


class GetInfoPaginated(Resource):
    def get(self):
        parser.add_argument('page_number', type=int)
        parser.add_argument('page_size', type=int)

        args = parser.parse_args()
        page_number = args["page_number"]
        page_size = args["page_size"]

        videoProperty = videoPropertyAPI()
        result, recordslist, exception = videoProperty.getPaginatedRecords(page_number, page_size)
        if result == 0:
            return json.dumps(
                    {
                        "videoProperties":recordslist,
                    }
                    ,
                    default=str)
        else:
            return json.dumps(
                    {
                        "videoProperties":exception
                    }
                    ,
                    default=str)



class SaveMetadata(Resource):
    def post(self):
        parser.add_argument('v_id', action='append')
        parser.add_argument('title', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('language', type=str)
        parser.add_argument('privacysettings', type=str)
        parser.add_argument('languagemodel', type=str)
        parser.add_argument('tags', action='append')
        parser.add_argument('category',action='append')
        parser.add_argument('deletemarker',type=str)
        args = parser.parse_args()
        v_id = args.v_id
        title = args["title"]
        description = args["description"]
        language = args["language"]
        privacysettings = args["privacysettings"]
        languagemodel = args["languagemodel"]
        tags = args.tags
        category = args.category
        deletemarker = args["deletemarker"]

        videoProperty = videoPropertyAPI()
        result, message = videoProperty.saveMetadata(v_id, title, description, language, privacysettings, languagemodel, tags, category,deletemarker)
        return json.dumps(
                    {
                       "saveresult":result,
                       "message":message
                    }
                    ,
                    default=str)


class GetTranscript(Resource):
    def post(self):
        parser.add_argument('v_id', type=str)
        args = parser.parse_args()
        v_id = args["v_id"]
        videoProperty = videoPropertyAPI()
        status,message = videoProperty.getTranscript(v_id)
        print(message)
        return json.dumps(
                    {
                       "transcript":message,
                    }
                    ,
                    default=str)


class UpdateTranscript(Resource):
    def post(self):
        parser.add_argument('v_id', type=str)
        parser.add_argument('timestamp', type=str)
        parser.add_argument('updated_transcript', type=str)
        args = parser.parse_args()
        v_id = args["v_id"]
        timestamp = args["timestamp"]
        updated_transcript = args["updated_transcript"]
        videoProperty = videoPropertyAPI()
        status, message = videoProperty.updateTranscript(v_id, timestamp, updated_transcript)
        return json.dumps(
                    {
                       "updateStatus":message,
                    }
                    ,
                    default=str)


class SearchRecord(Resource):
    def get(self):
        parser.add_argument('search_by_field', type=str)
        parser.add_argument('value', type=str)
        args = parser.parse_args()
        search_by_field = args["search_by_field"]
        value = args["value"]
        videoProperty = videoPropertyAPI()
        result = videoProperty.searchRecord(search_by_field, value)
        return json.dumps(
                    {
                       "search_result":result,
                    }
                    ,
                    default=str)


class GetTotalRecordsCount(Resource):
    def get(self):
        videoProperty = videoPropertyAPI()
        result = videoProperty.getTotalRecords()
        return json.dumps(
                    {
                       "TotalRecords":result,
                    }
                    ,
                    default=str)


api.add_resource(UploadSingleVideo, '/UploadVideo/')
api.add_resource(UploadMultipleVideos, '/UploadMultipleVideos/')
api.add_resource(RegisterNewUser, '/Register/')
api.add_resource(Login, '/Login/')
api.add_resource(GetInfo, '/GetInfo/')
api.add_resource(GetInfoPaginated, '/GetInfoPaginated/')
api.add_resource(ForgotPasswordRetreive, '/forgotPasswordRetreive/')
api.add_resource(SaveMetadata, '/saveMetadata/')
api.add_resource(GetTranscript, '/getTranscript/')
api.add_resource(UpdateTranscript, '/updateTranscript/')
api.add_resource(GetTotalRecordsCount, '/getTotalRecordsCount/')
api.add_resource(SearchRecord, '/searchRecord/')
api.add_resource(UploadModelFiles, '/UploadModelFiles/')


if __name__ == '__main__':
    app.run(debug=True, port=9091, host='0.0.0.0')



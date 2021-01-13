from login_utilities import checkEmail,registerData,checkEmailForgot,checkLogIn, retreivePasswordAndSendEmail


class RegistrationAndLogin:
    def register_new_user(self, email, firstname, lastname, password, confirmpassword):
        checkEmailFlag = checkEmail(email)
        
        if checkEmailFlag == "YES":
            return (-1, "Email already exists !!")    
        if "@" not in str(email) or ".com" not in str(email) or " "  in str(email):
            return (-1, "please give email in right format !!")
        if password != confirmpassword:
            return (-1, "password & confirm password not matching !!")
        if len(password) < 6 :
            return (-1, "please use more then 6 characters in password  !!")
                   
        if firstname == "" or lastname == "":
            return (-1, "Please provide first name and Last name  !!")
                   
        registerDataFlag, exception = registerData(email,firstname, lastname,password)
        
        if registerDataFlag == "YES" :
            return (0, "Registered Successfully  !!")
        else :
            return (-1, exception)

    def login(self, email, password):
        checkLoginFlag,email,first_name = checkLogIn(email,password)
        if checkLoginFlag == "YES":
            return ("YES", email, first_name, "Logged in successfully !!")
        else:
            return ("NO", email, first_name, "username or password is incorrect" )
    

    def forgotpassword(self, email):
        checkEmailFlag = checkEmailForgot(email)
        if checkEmailFlag['flag'] == "YES":
            return ("YES", checkEmailFlag['forgotEmail'], checkEmailFlag['forgotPassword'])        
        else :
            return ("NO","","")
    

    def forgotpasswordRetreive(self, app, mailserver, email):
        retrieveStatus, error = retreivePasswordAndSendEmail(app, mailserver, email)
        if retrieveStatus == "True":
            return ("True", error)        
        else :
            return ("False",error)
import pandas as pd 
from flask_mail import Mail, Message
from threading import Thread

def checkEmail(email):
    df = pd.read_csv('../user_data.csv') 
    if email  in list(df["email"].values):
        return "YES"
    else :
        return "NO"


def retreivePasswordAndSendEmail(app, mailserver, email):
    msg = Message()
    msg.subject = "Your password for Indic-AI"
    msg.recipients = [email]
    msg.sender = 'kamaleshtestacc@gmail.com'
    msg.body = 'test mail'
    try:
        df = pd.read_csv('../user_data.csv') 
        if email  in list(df["email"].values):
            forgotEmail = df[['email','password']][df['email']==email].values[0][0]
            forgotPassword = df[['email','password']][df['email']==email].values[0][1]
            msg.body = 'Your password is: ' + forgotPassword
            Thread(target=sendMail, args=(app, mailserver, msg)).start()
            return ("True","")
        else :
            return ("False","email not found")
    except Exception as ex:
        return ("False", ex)
    
    
    


def registerData(email,first_name,last_name,password):
    try :
        df_data = pd.DataFrame({
                "email":[email],
                "first":[first_name],
                "last":[last_name],
                "password":[password]
                }) 
        df = pd.read_csv('../user_data.csv')
        df = df.append(df_data,ignore_index=True)
        df.to_csv('../user_data.csv',index=False)        
        return ("YES","")
    except Exception as ex:
        return ("NO",ex)
    
    
    
def checkEmailForgot(email):
    df = pd.read_csv('../user_data.csv') 
    if email  in list(df["email"].values):
        forgotEmail = df[['email','password']][df['email']==email].values[0][0]
        forgotPassword = df[['email','password']][df['email']==email].values[0][1]
        return {"flag":"YES",
                "forgotEmail":forgotEmail,
                "forgotPassword":forgotPassword
                }
    else :
        return {"flag":"NO"}
    
    
def checkLogIn(email,password):
    try :
        df = pd.read_csv('../user_data.csv')
        if email  in list(df["email"].values):
            loginEmail = df[['email','password']][df['email']==email].values[0][0]
            loginPassword = df[['email','password']][df['email']==email].values[0][1]
            name = df[['first']][df['email']==email].values[0][0]
            if loginEmail == email and loginPassword == password:
                return "YES",loginEmail,name
            else:
                return "NO","NO","NO"
            
        else :
            return "NO","NO","NO"
    except:
        return "NO","NO","NO"


def sendMail(app, mailserver, msg):
    with app.app_context():
        mailserver.send(msg)

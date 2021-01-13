from datetime import date, datetime

def getNumberOfDaysFromCurrentDate(end_date):
    today = datetime.now()
    d1 = today.strftime("%Y:%m:%d %H:%M:%S")
    current_date = datetime.strptime(d1, '%Y:%m:%d %H:%M:%S')
    creation_date = datetime.strptime(end_date, '%Y:%m:%d %H:%M:%S')
    created_at = str(current_date - creation_date)
    str_list = created_at.split(',')
    numofdays = str_list[0] 
    return numofdays

def getCurrentDate():
    today = datetime.now()
    print(today)
    current_date = today.strftime("%Y:%m:%d %H:%M:%S")
    return current_date   

from pymongo import MongoClient


class DatabaseHandler:
    def __init__(self, db_name, collection_name):
        self.conn = MongoClient('mongodb://127.0.0.1:27017')
        self.db = self.conn[db_name]
        self.collist = self.db.list_collection_names()
        self.collection = []
        if collection_name in self.collist:
            self.collection = self.db[collection_name]
            print("The collection exists.")
        else:
            self.collection = self.db.create_collection(collection_name)


    def insertRecord(self,record):
        try:
            self.collection.insert_one(record)
            return (0, "Record inserted")
        except Exception as e:
            return (-1, e)        

    def fetchAllRecords(self):
        try:
            cursor = self.collection.find({'deletemarker': 'false'})
            #cursor = self.collection.find({})
            list_cur = list(cursor)
            return (0, list_cur, "")
        except Exception as e:
            return (-1, "", e)

    def checkIfExists(self,record):
        cursor = self.collection.find(record).sort("timestamp", 1)
        if cursor.count() > 0:
            return (True, list(cursor))
        else:
            return (False,[])


    def updateRecord(self, selection_criteria, update_data):
        try:
            self.collection.update(selection_criteria, update_data)
            return (0, "Record saved")
        except Exception as e:
            return (-1, e)

    def fetchPaginatedRecords(self, page_number, page_size):
        try:
            cursor = self.collection.find({'deletemarker': 'false'}).skip(page_number).limit(page_size)
            #cursor = self.collection.find({})
            list_cur = list(cursor)
            return (0, list_cur, "")
        except Exception as e:
            return (-1, "", e)


    def searchRecord(self, search_by_field, value):
        try:
            tofind = "%s"%(value)
            #query = { search_by_field: { "$regex": tofind } }
            query = {"$and": [{search_by_field: {'$regex': tofind}},
                          {'deletemarker': 'false'}]}
            cursor = self.collection.find(query)
            list_cur = list(cursor)
            return (0, list_cur, "")
        except Exception as e:
            return (-1, "", e)

    def getTotalRecords(self):
        try:
            cursor = self.collection.find({'deletemarker': 'false'})
            list_cur = list(cursor)
            return len(list_cur)
        except Exception as e:
            return e


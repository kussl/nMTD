import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import FirebaseKeys as Keys

cred = credentials.Certificate(Keys.certificate)
default_app = firebase_admin.initialize_app(cred,{
    'databaseURL' : Keys.databaseURL
})


def getServerTime():
    time = db.reference("Server/1")
    for i in time.get():
        return time.get()[i]['time']
server_time = getServerTime()
# tokens = db.reference(FBPath)
# string = '\n'
# total = 0
# counter = 0
# data = tokens.get()
# for x in data:
#     counter+=1
#     string+= str(counter) + " : " + str(data[x]['time']) + "\n"
#     total+=  data[x]['time']
# string+= "Average : " + str(total/counter)
# f = open(filename,"a")
# f.write(string)
# f.close()
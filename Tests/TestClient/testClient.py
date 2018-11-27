from selenium import webdriver
import selenium.webdriver.support.ui as ui
import subprocess
import os
from selenium.webdriver.firefox.options import Options


from selenium.webdriver.common.keys import Keys as keys 
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import FirebaseKeys as Keys
import time 
import json
import threading
cred = credentials.Certificate(Keys.certificate)
default_app = firebase_admin.initialize_app(cred,{
    'databaseURL' : Keys.databaseURL
})

def clean(FBPath):
    db.reference(FBPath).delete()

def createBrowserChrome(n):
    chrome_options = webdriver.ChromeOptions()
    prefs = {"profile.default_content_setting_values.notifications" : 1}
    chrome_options.add_experimental_option("prefs",prefs)
    # chrome_options.set_headless(headless=True)
    d = []
    for x in range(0,n):
        d.append( webdriver.Chrome(executable_path='./chromedriver',chrome_options=chrome_options))
    return d
def createBrowserFirefox(n):
    firefox_profile = webdriver.FirefoxProfile()
    firefox_profile.set_preference('permissions.default.desktop-notification', 1)
    options = Options()
    # options.add_argument("--headless")
    d = []
    for x in range(0,n):
        d.append( webdriver.Firefox(firefox_profile=firefox_profile,options=options))
    return d

def newTab(driver,link):
    driver.execute_script("window.open('"+link+"');")

def switch_to(driver,tab):
    driver.switch_to.window(driver.window_handles[tab])

def delete_cookies(driver):
    driver.delete_all_cookies()

def closeBrowser(list):
    for i in list:
        i.close()

def refresh(list):
    for i in list:
        i.refresh()

def writeToFile(filename,FBPath):
    try:
        tokens = db.reference(FBPath)
        string = '\n'
        total = 0
        counter = 0
        data = tokens.get()
        for x in data:
            counter+=1
            string+= str(counter) + " : " + str(data[x]['time']) + "\n"
            total+=  data[x]['time']
        string+= "Average : " + str(total/counter)
        f = open(filename,"a")
        f.write(string)
        f.close()
    except:
        print ("no data")

def writeToFile2(filename,FBPath):
    try:
        tokens = db.reference(FBPath)
        string = '\n'
        total = 0
        counter = 0
        data = tokens.get()
        s = {}
        for x in data:
            if(s.has_key(data[x]['token'])):
                if( s[data[x]['token']] > data[x]['time']):
                    s[data[x]['token']] = data[x]['time']
            else:
                s[data[x]['token']] = data[x]['time']

        f = open(filename,"a")
        for x in s:
            counter+=1
            f.write(str(counter) + " : " + str(s[x]) + "\n")
        f.write("Average : " + str(total/counter))
        f.close()
    except:
        print ("no data")   

def ClientRegister(numberOfClients,numberOfTimes,timer,path):
    # clean("Timers/"+path)
    list = createBrowserChrome(numberOfClients)
    for item in list:
        item.get("http://localhost/register/"+path)
    # for x in range(0,numberOfTimes):
    #     time.sleep(timer)
    #     refresh(list)
    # writeToFile("ClientRegister"+str(numberOfClients)+"-"+str(numberOfTimes)+".txt","Timers/"+path)
    # closeBrowser(list)
    # clean("Timers/"+path)
    

def ClientRegister2(numberOfClients,numberOfTimes,timer,path):
    clean("Timers/"+path)   
    driver = createBrowserFirefox(1)[0]
    for i in range(0,numberOfClients):
        newTab(driver,"http://localhost/register/"+path)
        # i.get("http://localhost/register/"+path)
    # for i in range(0,numberOfTimes):
    #     time.sleep(timer)
    #     refresh(driver)
    writeToFile("ClientRegister"+str(numberOfClients)+"-"+str(numberOfTimes)+".txt","Timers/"+path)
    # closeBrowser(list)  
    driver.close()

def identification_isolation():
    print("identification/isolation")
list = createBrowserChrome(20)
for item in list:
    item.get("http://localhost/register/1")
    print ("done")

ClientRegister(1,10,10,'1')
ClientRegister(10,10,5,'10')
ClientRegister(35,1,30,'100')
ClientRegister2(100,10,10,'100')
threads = []
numberOfClients = 12
numberOfTimes = 20
timer = 2
path = '100'
flag = True
numberOfThreads = 3
for i in range(numberOfThreads):
    t = threading.Thread(target=ClientRegister, args=(numberOfClients,numberOfTimes,timer,path,))
    threads.append(t)
    t.start()
t.join()
if flag:
    flag = False
    writeToFile("ClientRegister"+str(numberOfClients)+"-"+str(numberOfTimes)+".txt","Timers/"+path)
    clean("Timers/"+path)

writeToFile("ClientRegister"+str(100)+"-"+str(100)+".txt","Timers/100")




      




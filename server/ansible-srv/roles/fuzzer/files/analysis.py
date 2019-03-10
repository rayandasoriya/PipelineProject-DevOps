import xmltodict
import json
import os
from operator import itemgetter

#files = os.listdir("/Users/rayandasoriya/Desktop/Projects/devops/iTrust-fuzzer/BuildResults/1/surefire-reports/")
pathToReports = "/Users/jubeenshah/Desktop/NCSU/SEM-2/CSC519-Devops/Project/Master/screencast/CSC519-Project/server/jenkins-srv/BuildResults.1/"
#pathToReports = "/home/vagrant/BuildResults/"
files = os.listdir(pathToReports)

dictonaryOfFiles = {}
count = 0
failed = 0
passed = 0
errored = 0
new_arr = []
info = []

for eachFile in files:
    eachFileDir = pathToReports + eachFile + "/surefire-reports"
    detailedReport = os.listdir(eachFileDir)
    file = []
    for i in detailedReport:
        if ".xml" in i:
            file.append(i)
    dictonaryOfFiles[eachFile] = file


for key in dictonaryOfFiles:
    #print("\nKEY : "+ key)
    #print(dictonaryOfFiles[key])
    #print("\n")
    for eachXML in dictonaryOfFiles[key]:
        #print(eachXML)
        pathToXML = pathToReports + key + "/surefire-reports/" + eachXML
        file = open(pathToXML, 'r')
        content = file.read()
        a = xmltodict.parse(content)
        #print(a)
        for j in range(0,int(a["testsuite"]["@tests"])):
            try:
                if int(a["testsuite"]["@tests"]) == 1:

                    if "failure" in a["testsuite"]["testcase"].keys() :
                        info.append([i, a["testsuite"]["testcase"]["@name"], a["testsuite"]["testcase"]["@time"], "failed"])
                        failed += 1
                    
                    elif "error" in a["testsuite"]["testcase"].keys() :
                        info.append([i, a["testsuite"]["testcase"]["@name"], a["testsuite"]["testcase"]["@time"], "errored"])
                        errored += 1

                    else:
                        info.append([i, a["testsuite"]["testcase"]["@name"], a["testsuite"]["testcase"]["@time"], "passed"])
                        passed += 1
                    continue

                if "failure" in a["testsuite"]["testcase"][j].keys():
                    info.append([i, a["testsuite"]["testcase"][j]["@name"], a["testsuite"]["testcase"][j]["@time"], "failed"])
                    failed +=1
                elif "error" in a["testsuite"]["testcase"][j].keys():
                    info.append([i, a["testsuite"]["testcase"][j]["@name"], a["testsuite"]["testcase"][j]["@time"], "errored"])
                    errored +=1
                else:
                    info.append([i, a["testsuite"]["testcase"][j]["@name"], a["testsuite"]["testcase"][j]["@time"], "passed"])
                    passed += 1

            except:
                count+=1
test = set()
for m in info:
    test.add(m[1])
test = tuple(test)
ttime = 0
res = []
for i in test:
    count_ff = 0
    count_pp = 0
    count_ee = 0
    time = 0
    for j in info:
        if j[1] == i:
            time+=float(j[2])
            if j[3] == 'failed':
                count_ff += 1
            elif j[3] == 'errored':
                count_ee += 1
            else: 
                count_pp += 1
    total = count_ff+count_pp+count_ee
    avg_time = round(time/total,2)
    ttime+=time
    res.append([i,count_pp,count_ff,count_ee,(-1*avg_time)])

res = sorted(res, key= itemgetter(2,4), reverse = True)

for m in res:
    print("\n")
    print(m[0])
    print('Passed: {}, \tFailed: {}, \tErrored: {}, \tAvgTime: {} '.format(m[1],m[2],m[3],(-1*m[4])))

print("\n********************************************************************************************\n")
print('Total Passed: {}, \tTotal Failed: {}, \tTotal \tErrors: {}, \tTotal Time: {}'.format(passed,failed,errored,(round(ttime,2))))
print("\n********************************************************************************************\n")


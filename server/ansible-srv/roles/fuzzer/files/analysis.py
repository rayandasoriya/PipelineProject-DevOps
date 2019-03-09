import xmltodict
import json
import os
from operator import itemgetter

#files = os.listdir("/Users/rayandasoriya/Desktop/Projects/devops/iTrust-fuzzer/BuildResults/1/surefire-reports/")
files = os.listdir("/home/vagrant/BuildResults/1/surefire-reports/")

file = []
for i in files:
    if ".xml" in i:
        file.append(i)
        count+=1
count = 0
failed = 0
passed = 0
errored = 0
new_arr = []
info = []

f_len = os.listdir("/home/vagrant/BuildResults/")

for f in file:
    for i in range(1,len(f_len)):
        f_name = '/home/vagrant/BuildResults/'+str(i)+'/surefire-reports/'+f
        #f_name = '/Users/rayandasoriya/Desktop/Projects/devops/iTrust-fuzzer/BuildResults/'+str(i)+'/surefire-reports/'+f
        file = open(f_name, 'r') 
        content = file.read()
        a = xmltodict.parse(content)

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
    print(m[0])
    print('Passed: {}, Failed: {}, Errored: {}, AvgTime: {} '.format(m[1],m[2],m[3],(-1*m[4])))

print('Total Passed: {}, Total Failed: {}, Total Errors: {}, Total Time: {}'.format(passed,failed,errored,(round(ttime,2))))

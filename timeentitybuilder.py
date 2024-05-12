def defineHourOrMinutes(start, end):
    hour = []
    for i in range (start,end):
        timeInString = str(i)
        finalTimeInString = ""
        if (len(timeInString) < 2):
            print(len(timeInString))
            finalTimeInString = "0%s"%timeInString
        else:
            finalTimeInString = timeInString
        hour.append(finalTimeInString)
    return hour
# print(defineHourOrMinutes(0,60))
# print(defineHourOrMinutes(1,25))

def defineTimeInBetterFormat():
    hour = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    minute = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    finalFormTime = []
    for i in hour:
        for j in minute:
            form1 = i+":"+j
            # form2 = str(int(i))+":"+j
            finalFormTime.append(form1)
            # finalFormTime.append(form2)
    return finalFormTime
# print(defineTimeInBetterFormat())

def createTheActualEntity():
    time = defineTimeInBetterFormat()
    timeEntityJSONs = []
    for i in time:
        listSynonims = []
        withzero = i
        hours, minutes = withzero.split(':')
        if(hours.startswith('0')):
            hours = str(int(hours))
            withoutzero = hours + ':' + minutes
            listSynonims.append(withzero)
            listSynonims.append(withoutzero)
        else:
            listSynonims.append(withzero)
        timeEntityObject = dict(keyword=i,synonyms=listSynonims)
        timeEntityJSONs.append(timeEntityObject)
    return timeEntityJSONs

my_list = createTheActualEntity()
with open('timeentity.txt', 'w') as file:
    file.write(str(my_list))
file.close()




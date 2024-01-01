from selenium import webdriver
from time import sleep
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import csv
import sys

driver =  webdriver.Chrome(r'G:\nodejs\chromedriver.exe')
driver.get('https://www.google.com/search?q=perpustakaan+jogja&client=firefox-b-d&sca_esv=594830272&biw=1326&bih=707&tbm=lcl&ei=7E6SZYbMH--YjuMP0-G32AM&ved=0ahUKEwiG8qHmu7uDAxVvjGMGHdPwDTsQ4dUDCAk&uact=5&oq=perpustakaan+jogja&gs_lp=Eg1nd3Mtd2l6LWxvY2FsIhJwZXJwdXN0YWthYW4gam9namEyChAAGIAEGIoFGEMyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBhAAGAcYHjIFEAAYgAQyBxAAGIAEGApItANQAFgAcAB4AJABAJgBOaABOaoBATG4AQPIAQCIBgE&sclient=gws-wiz-local#rlfi=hd:;si:;mv:[[-7.7715492,110.4103315],[-7.822547999999999,110.3496887]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!2m1!1e3!3sIAE,lf:1,lf_ui:3')
sleep(2)
library = driver.find_element_by_xpath('//*[@id="tsuid_9"]')
library.click()
sleep(8)

test = driver.find_elements_by_xpath('//*[@role="button" and @jsaction="zwAFKf"]')

# test = driver.find_elements_by_xpath('//*[@id="akp_tsuid_29"]/div/div[1]/div/g-sticky-content-container/div/block-component/div/div[1]/div/div/div/div[1]/div/div/div[6]/g-flippy-carousel/div/div/ol/li[1]/span/div/div/div/div[9]/div[2]/a[@role="button"]')

sleep(5)
if test:
    test = test[0]
    test.click()
    sleep(8)
    scrollable = driver.find_element_by_xpath('//*[@id="pqaQ"]/div/div/div[1]/div/div[2]')

    last_height = driver.execute_script("return arguments[0].scrollHeight", scrollable)

    while True:
        scrollable = driver.find_element_by_xpath('//*[@id="pqaQ"]/div/div/div[1]/div/div[2]')
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", scrollable)
        sleep(3)

        new_height = driver.execute_script("return arguments[0].scrollHeight", scrollable)
        if new_height == last_height:
            break

        last_height = new_height

    question_texts = []

    last_question = None

    questions = driver.find_elements_by_css_selector('.mq1Pic.dFINPc.aTWSi')
    question_texts = [question.text for question in questions]

    with open('questions.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["Question"])
        for question in question_texts:
            writer.writerow([question])

else:
    sys.exit("dosen exis")



# scrollable = driver.find_element_by_xpath('//*[@id="pqaQ"]/div/div/div[1]/div/div[2]')

# for i in range(50):
#     driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", scrollable)
#     sleep(2)






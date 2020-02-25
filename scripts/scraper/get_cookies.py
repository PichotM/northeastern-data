from selenium import webdriver
import time
import requests
import json

duo_options = ["Send Me a Push", "Call Me", "Enter a Passcode"]
# default is "send me a push"
duo_option = 0

# docs
# application refers to the job post
nu_careers_actions = {
    "get": {
        "applicationQualifiers": "_-_-aCOIYX1azel9tzqMYJPEXqTl3ijFQVzAp9VBMoVXZXe2IZajiTaC4UJj5H7mPas90MVPEGDsiaBMMmo7czMXF5SzCMEe-19qIuMeP1ktw5vKv350caw2Erm0f231E_93jOuzunixQv2UnNHOCLkoBVDXa_cinYnfjX7jIg-KPISnDY3AUAVz1FeyZQ",
        "getApplication": "_-_-31NI8mbvq-dP-gTmjVErKfmH19kP95a7iFGSdi4tdGTbvo3Ddm6WrIL4aMY0ms3uZxcLq4prGJPBtGm3-Y_H4nTQk_FxURbWLej6V5TIKPwS_N_sKn-QihpuXbfp5276e3EJR4212f6qIgFCJIGzfxJ0ieRxbTV7vtp5V8kZIlg"
    }
}


def fetch_cookies_from_nu_careers():
    with open('./private_creditentials.json') as d:
        creditentials = json.load(d)

    driver = webdriver.Chrome()
    driver.get("https://nucareers.northeastern.edu/Shibboleth.sso/Login?target=https://nucareers.northeastern.edu/secure/neuLogin.htm?action=login")

    while (driver.title != "Log in"):
        time.sleep(10)

    username_input = driver.find_element_by_name("j_username")
    username_input.clear()
    username_input.send_keys(creditentials['username'])

    password_input = driver.find_element_by_name("j_password")
    password_input.clear()
    password_input.send_keys(creditentials['password'])

    connect_button = driver.find_element_by_name("_eventId_proceed")
    connect_button.click()

    while not driver.find_element_by_id("duo_iframe"):
        time.sleep(1)

    driver.switch_to.frame(driver.find_element_by_id("duo_iframe"))

    while not driver.find_elements_by_class_name("auth-button"):
        time.sleep(1)
        print("waiting for duo")

    duo_buttons = driver.find_elements_by_class_name("auth-button")
    for button in duo_buttons:
        if button.text in duo_options and button.text == duo_options[duo_option]:
            button.click()
            print("duo request sent")
            break

    while (driver.title != "Northeastern University - MyAccount - Dashboard"):
        time.sleep(3)
        print("waiting duo confirmation")

    driver.get("https://nucareers.northeastern.edu/myAccount/co-op/jobs.htm")

    neu_career_cookies = driver.get_cookies()
    
    with open('private_cookies.json', 'w') as f:
        json.dump(neu_career_cookies, f)

    return neu_career_cookies

fetch_cookies_from_nu_careers()
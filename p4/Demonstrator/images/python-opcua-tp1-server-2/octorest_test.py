#!/usr/bin/env python3

from octorest import OctoRest
from datetime import datetime

# Standardmäßig eingeschalten
isPrinterOnline = True
# Derzeitiger Druckfortschritt
currentProgress = 0
progressByStep = 1
# Derzeitiger Druckfortschritt
defaultPrintingTime = 100
currentEstimatedTime = defaultPrintingTime

# Flag zum Neustarten des Druckers
flagShutdown = False
flagStartup = False
flagWait = False

# Ist der Druck aktiv
isPrinting = False

# Gibt an, ob der Drucker eingeschalten ist
def get_state():
    global flagShutdown
    global flagStartup
    global flagWait
    global isPrinterOnline
    global currentEstimatedTime
    global currentProgress

    if flagShutdown == True:
        # shutdown
        flagShutdown = False
        isPrinterOnline = False
        currentEstimatedTime = defaultPrintingTime
        currentProgress = 0
        flagWait = True
        return isPrinterOnline

    if flagWait == True:
        # wait
        flagWait = False
        flagStartup = True
        return isPrinterOnline

    if flagStartup == True:
        # startup
        flagStartup = False
        isPrinterOnline = True
        return isPrinterOnline

    return isPrinterOnline

# Geschätzte Restzeit
def get_jobinfo_estimated_time():
    global defaultPrintingTime

    return defaultPrintingTime

# Derzeitiger Druckfortschritt
def get_jobinfo_completion():
    global currentProgress
    global flagShutdown
    global isPrinting
    global progressByStep

    if isPrinterOnline == False:
        return currentProgress

    currentProgress += progressByStep

    if currentProgress >= 100:
        currentProgress = 100
        flagShutdown = True

    if isPrinting == False:
        currentProgress = 0

    return currentProgress

def set_is_printing(printing):
    global isPrinting

    isPrinting = printing

# Wird zwar verwendet, soll aber nicht verwendet werden.
# Deshalb wird es hier gar nicht erst simuliert.
def get_jobinfo_print_time_current():
    global currentEstimatedTime

    if isPrinterOnline == False:
        return currentEstimatedTime

    currentEstimatedTime = currentProgress

    return currentEstimatedTime

def get_state_message():
    return "<Operational>"
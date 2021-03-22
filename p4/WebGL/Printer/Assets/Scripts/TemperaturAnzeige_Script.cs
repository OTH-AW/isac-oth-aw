using UnityEngine;
using System;
using System.Runtime.InteropServices;
using System.Globalization;
using System.Collections;

public class TemperaturAnzeige_Script : MonoBehaviour
{
    public TextMesh DebugOrange;
    public TextMesh DebugBlue;
    public TextMesh DebugOrangeProgress;
    public TextMesh DebugBlueProgress;

    public string DebugTextOrange;
    public string DebugTextBlue;

    public bool StateOnlineOrange;

    public bool StateOnlineBlue;

    public bool IsPrintingOrange;

    public bool IsPrintingBlue;

    public double ProgressPrinterOrange;
    public double ProgressPrinterBlue;

    public static bool isConnected;
    public static bool tryConnecting;

    [DllImport("__Internal")]
    private static extern void ConnectToOpcuaThroughProxy(string proxyUrl, string printerColor, string opcuaNode, string callbackGameObject, string callbackMethod, string callbackSocketClosed);

    public bool simulatePrintOrange = true;
    public bool simulatePrintBlue = true;

    public bool translateRight_Orange = true;
    public bool translateRight_Blue = true;

    public GameObject[] printerHeadOrange;
    public GameObject[] printerHeadBlue;

    private int isTimeToTryAgainNextUpdate = 1;

    void Start()
    {
        // https://docs.unity3d.com/ScriptReference/GameObject.FindGameObjectsWithTag.html
        printerHeadOrange = GameObject.FindGameObjectsWithTag("Head_Orange");
        printerHeadBlue = GameObject.FindGameObjectsWithTag("Head_Blue");
    }

    // Update is called once per frame
    void Update()
    {
        simulatePrintOrange = StateOnlineOrange && IsPrintingOrange;
        simulatePrintBlue = StateOnlineBlue && IsPrintingBlue;

        // simulatePrintOrange = true;
        // simulatePrintBlue = true;

        if (simulatePrintOrange) {
            // ORANGE
            var movement_Orange = Vector3.Lerp(new Vector3(0, 0, 0), new Vector3(0.1f, 0, 0), 0.05f);

            if (!translateRight_Orange) {
                movement_Orange *= -1;
            }

            foreach (GameObject go in printerHeadOrange)
            {
                if (go.transform.localPosition.x > 1.0) {
                    translateRight_Orange = false;
                } else if (go.transform.localPosition.x < 0.0) {
                    translateRight_Orange = true;
                }

                go.transform.localPosition += movement_Orange;
            }
        }

        if (simulatePrintBlue) {
            // BLUE
            var movement_Blue = Vector3.Lerp(new Vector3(0, 0, 0), new Vector3(0.1f, 0, 0), 0.05f);

            if (!translateRight_Blue) {
                movement_Blue *= -1;
            }

            foreach (GameObject go in printerHeadBlue)
            {
                if (go.transform.localPosition.x > 1.0) {
                    translateRight_Blue = false;
                } else if (go.transform.localPosition.x < 0.0) {
                    translateRight_Blue = true;
                }

                go.transform.localPosition += movement_Blue;
            }
        }



        if (!isConnected && !tryConnecting && Time.time >= isTimeToTryAgainNextUpdate)
        {
            tryConnecting = true;

            // Change the next update (current second + 1)
            isTimeToTryAgainNextUpdate = Mathf.FloorToInt(Time.time) + 1;
            
			
            Uri myUri = null;
			if (Application.absoluteURL == string.Empty || Application.absoluteURL.StartsWith("file:///"))
            {
				myUri = new Uri("http://localhost");
			} else
            {
				myUri = new Uri(Application.absoluteURL);
			}

            try
            {
                // Orange, Blue
                ConnectToOpcuaThroughProxy(String.Format("ws://{0}:8089", myUri.Host), "Orange", "ns=2;i=11", "Opcua", "SetPrinterName_Orange", "ConnectionClosed");
                ConnectToOpcuaThroughProxy(String.Format("ws://{0}:8089", myUri.Host), "Orange", "ns=2;i=15", "Opcua", "SetStateOnline_Orange", "ConnectionClosed");
                ConnectToOpcuaThroughProxy(String.Format("ws://{0}:8089", myUri.Host), "Orange", "ns=2;i=21", "Opcua", "SetIsPrinting_Orange", "ConnectionClosed");
                ConnectToOpcuaThroughProxy(String.Format("ws://{0}:8089", myUri.Host), "Orange", "ns=2;i=25", "Opcua", "SetPrintingProgress_Orange", "ConnectionClosed");

                ConnectToOpcuaThroughProxy(String.Format("ws://{0}:8089", myUri.Host), "Blue", "ns=2;i=11", "Opcua", "SetPrinterName_Blue", "ConnectionClosed");
                ConnectToOpcuaThroughProxy(String.Format("ws://{0}:8089", myUri.Host), "Blue", "ns=2;i=15", "Opcua", "SetStateOnline_Blue", "ConnectionClosed");
                ConnectToOpcuaThroughProxy(String.Format("ws://{0}:8089", myUri.Host), "Blue", "ns=2;i=21", "Opcua", "SetIsPrinting_Blue", "ConnectionClosed");
                ConnectToOpcuaThroughProxy(String.Format("ws://{0}:8089", myUri.Host), "Blue", "ns=2;i=25", "Opcua", "SetPrintingProgress_Blue", "ConnectionClosed");
                isConnected = true;
            }
            catch (EntryPointNotFoundException)
            {
                // Verbindung kann nicht aufgebaut werden
                // Debug.Log("Can't connect to server");
            }
            finally
            {
                tryConnecting = false;
            }
            
        }

        this.DebugOrange.text = this.DebugTextOrange;
        this.DebugBlue.text = this.DebugTextBlue;

        this.DebugOrangeProgress.text = this.IsPrintingOrange ? this.ProgressPrinterOrange + "%" : "-";

        this.DebugBlueProgress.text = this.IsPrintingBlue ? this.ProgressPrinterBlue + "%" : "-";
    }

    void SetPrinterName_Orange(string name)
    {
        this.DebugTextOrange = name;
    }

    void SetPrinterName_Blue(string name)
    {
        this.DebugTextBlue = name;
    }

    void SetStateOnline_Orange(string isOnline)
    {
        this.StateOnlineOrange = Convert.ToBoolean(isOnline);
    }

    void SetStateOnline_Blue(string isOnline)
    {
        this.StateOnlineBlue =  Convert.ToBoolean(isOnline);
    }

    void SetIsPrinting_Orange(string isPrinting)
    {
        this.IsPrintingOrange = Convert.ToBoolean(isPrinting);
    }

    void SetIsPrinting_Blue(string isPrinting)
    {
        this.IsPrintingBlue = Convert.ToBoolean(isPrinting);
    }

    void SetPrintingProgress_Orange(string progress)
    {
        this.ProgressPrinterOrange = Convert.ToDouble(progress);
    }

    void SetPrintingProgress_Blue(string progress)
    {
        this.ProgressPrinterBlue = Convert.ToDouble(progress);
    }

    void ConnectionClosed()
    {
        isConnected = false;
    }
}
   
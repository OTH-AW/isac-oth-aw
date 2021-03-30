using UnityEngine;
using System;
using System.Runtime.InteropServices;
using System.Globalization;

public class CustomTemperaturTextMesh : MonoBehaviour
{
	public TextMesh TemperatureMesh;
	public double CurrentTemperature = 20;
	
	public static bool isConnected;

    [DllImport("__Internal")]
    private static extern void ConnectToOpcuaThroughProxy(string proxyUrl, string opcuaNode, string callbackGameObject, string callbackMethod, string callbackSocketClosed);

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
		if (!isConnected) {
			isConnected = true;
			ConnectToOpcuaThroughProxy("ws://localhost:8089", "ns=2;i=2", "Temperatur Anzeige", "SetTemperature", "ConnectionClosed");
        }

        TemperatureMesh.text = string.Format("{0:0.00} °C", CurrentTemperature);
    }
	
	void SetTemperature(string temperature)
	{
		CurrentTemperature = Math.Round(double.Parse(temperature, CultureInfo.InvariantCulture), 2);
	}

    void ConnectionClosed()
    {
        isConnected = false;
    }
}

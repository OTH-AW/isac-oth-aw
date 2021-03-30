using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RightButtonPressed_Script : MonoBehaviour
{

    public bool isPressed = false;

    // Start is called before the first frame update
    void Start()
    {
    
    }

    // Update is called once per frame
    void Update()
    {
       
    }

    public void onPointerDown()
    {
        isPressed = true;
    }

    public void onPointerUp()
    {
        isPressed = false;
    }
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KameraMovement_Script : MonoBehaviour
{
    public float speed = 5.0f;
    //public float speedH = 4.0f;
    //public float speedV = 4.0f;

    public Transform target;

    private float yaw = 0.0f;
    private float pitch = 0.0f;


    private LeftButtonPressed_Script moveLeft;
    private RightButtonPressed_Script moveRight;

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

        // Button Control
        moveLeft = GameObject.Find("LeftButton").GetComponent<LeftButtonPressed_Script>();
        if (moveLeft.isPressed == true)
        {
            transform.Translate(new Vector3(-speed * Time.deltaTime, 0, 0));
        }

        moveRight = GameObject.Find("RightButton").GetComponent<RightButtonPressed_Script>();
        if (moveRight.isPressed == true)
        {
            transform.Translate(new Vector3(speed * Time.deltaTime, 0, 0));
        }




        // Keyboard Control
        if (Input.GetKey(KeyCode.W))
        {
            transform.Translate(new Vector3(0, 0, speed * Time.deltaTime));
        }
        if (Input.GetKey(KeyCode.S))
        {
            transform.Translate(new Vector3(0, 0, -speed * Time.deltaTime));
        }
        if (Input.GetKey(KeyCode.D))
        {
            transform.Translate(new Vector3(speed * Time.deltaTime, 0, 0));
        }
        if (Input.GetKey(KeyCode.A))
        {
            transform.Translate(new Vector3(-speed * Time.deltaTime, 0, 0));
        }
        if (Input.GetKey(KeyCode.LeftControl))
        {
            transform.position = transform.position + (new Vector3(0, -speed * Time.deltaTime, 0));
        }
        if (Input.GetKey(KeyCode.Space))
        {
            transform.position = transform.position + (new Vector3(0, speed * Time.deltaTime, 0));
        }

        // Mouse Control
        if (Input.GetKey(KeyCode.Mouse0))
        {
           yaw += 4.0f * Input.GetAxis("Mouse X");
           pitch -= 4.0f * Input.GetAxis("Mouse Y");

           transform.eulerAngles = new Vector3(pitch, yaw, 0.0f);
        }
        if (transform.rotation.z != 0)
        {
           transform.rotation = Quaternion.Euler(pitch, yaw, 0);
        }

        // How to Install Cinemachine in Unity
        // https://www.youtube.com/watch?v=VMN3JSQjtIc
                
        // https://www.youtube.com/watch?v=q1fkx94vHtg
        // https://learn.unity.com/tutorial/cinemachine#5c7f8528edbc2a002053b4ec
        
        // Lookat Script
        // https://www.youtube.com/watch?v=MFQhpwc6cKE
        transform.LookAt(target);
        
    }

}

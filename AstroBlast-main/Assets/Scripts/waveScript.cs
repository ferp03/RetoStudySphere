using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class waveScript : MonoBehaviour
{
    public float speed = 2f;
    public Rigidbody2D rb;

    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (transform.position.x > 0) {
        transform.position = transform.position + (Vector3.left * speed) * Time.deltaTime;
        }
    }
}

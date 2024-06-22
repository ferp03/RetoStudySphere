using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerMainMenu : MonoBehaviour
{
    public GameObject blaster;
    public float blasterSpeed = 10f;
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }

    public void Shoot()
    {
        GameObject blasterClone = Instantiate(blaster, transform.position, transform.rotation);
        Rigidbody2D rb = blasterClone.GetComponent<Rigidbody2D>();
        rb.velocity = transform.right * blasterSpeed;
    }

}

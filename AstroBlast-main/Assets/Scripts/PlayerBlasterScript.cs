using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;

public class basterScript : MonoBehaviour
{
    public float speed = 10f;
    public Animator animator;
    public LogicManagerScript logic;
    
    void Start()
    {
        animator = GetComponent<Animator>();
        logic = GameObject.FindGameObjectWithTag("LogicManager").GetComponent<LogicManagerScript>();
    }

    // Update is called once per frame
    void Update()
    {
        if (transform.position.x > 9)
        {
            Destroy(gameObject);
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("Enemy"))
        {
            animator.SetBool("hit", true);
            Destroy(gameObject);
        }

        if (other.gameObject.CompareTag("Asteroid"))
        {
            animator.SetBool("hit", true);
            Destroy(gameObject);
        }
    }


}

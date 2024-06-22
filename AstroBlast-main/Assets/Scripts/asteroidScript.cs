using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class asteroidScript : MonoBehaviour
{
    public Rigidbody2D rb;
    public Animator animator;
    public float speed = 2f;
    public float rotationSpeed = 200f;
    public int health = 2;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();
    }

    // Update is called once per frame
    void Update()
    {
        transform.position = transform.position + (Vector3.left * speed) * Time.deltaTime;
        transform.Rotate(Vector3.forward * rotationSpeed * Time.deltaTime);

        if (transform.position.x < -9)
        {
            Destroy(gameObject);
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("Player"))
        {
            animator.SetBool("asteroidExplode", true);
            Destroy(gameObject, 0.5f);
        }
        if (other.gameObject.CompareTag("PlayerBlaster"))
        {
            if (health > 1)
            {
                health--;
                animator.SetBool("asteroidHit", true);
            }
            else
            {  
                GetComponent<Collider2D>().enabled = false;
                animator.SetBool("asteroidExplode", true);
                Destroy(gameObject, 0.5f);
            }
        }
    }
}

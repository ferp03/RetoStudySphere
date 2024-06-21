using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyBlasterScript : MonoBehaviour
{
    
    public float speed = 10f;
    public Rigidbody2D rb;
    public Animator animator;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();

        transform.position = transform.position + (Vector3.left * speed) * Time.deltaTime;
    }

    // Update is called once per frame
    void Update()
    {
        if (transform.position.x < -9)
        {
            Destroy(gameObject);
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("Player"))
        {
            animator.SetBool("hit", true);
            Destroy(gameObject);
        }
    }
}

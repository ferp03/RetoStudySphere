using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyScript : MonoBehaviour
{
    public Animator animator;
    public GameObject blaster;
    public LogicManagerScript logic;
    public AudioSource SFX;
    public AudioClip hit;
    public float blasterSpeed = 10f;
    private float attackTimer = 0.35f;
    public float attackCd = 0.60f;
    private bool enemyHit = false;
    void Start()
    {
        logic = GameObject.FindGameObjectWithTag("LogicManager").GetComponent<LogicManagerScript>();
    }

    // Update is called once per frame
    void Update()
    {
        attackTimer += Time.deltaTime;
        if (attackTimer > attackCd) {
            attackTimer = 0;
            GameObject blasterClone = Instantiate(blaster, new Vector3(transform.position.x, transform.position.y, 0), transform.rotation);
            Rigidbody2D rb = blasterClone.GetComponent<Rigidbody2D>();

            rb.velocity = transform.right * -1 * blasterSpeed;
        }
        
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("PlayerBlaster"))
        {
            if (!enemyHit)
            {
                logic.addKill();
                enemyHit = true;
            }
            animator.SetBool("enemyHit", true);
            SFX.PlayOneShot(hit);
            Destroy(gameObject, 0.5f);
            Destroy(other.gameObject);    
        }
        
    }
}

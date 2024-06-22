using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class movingEnemyScript : MonoBehaviour
{
    public Rigidbody2D rb;
    public Animator animator;
    public GameObject blaster;
    public LogicManagerScript logic;
    public AudioSource SFX;
    public AudioClip hit;
    public float blasterSpeed = 10f;
    private float attackTimer = 0.35f;
    public float attackCd = 0.60f;
    public float speed = 5f;
    public float topY = 4;
    public float bottomY = -4;
    public float waitTime = 0.2f;
    private bool enemyHit = false;
    void Start()
    {
        logic = GameObject.FindGameObjectWithTag("LogicManager").GetComponent<LogicManagerScript>();
        StartCoroutine(MoveUpDown());
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

    IEnumerator MoveUpDown()
    {
        while (true)
        {
            // Move to the top
            while (transform.position.y < topY)
            {
                transform.position = new Vector3(transform.position.x, transform.position.y + speed * Time.deltaTime, transform.position.z);
                yield return null;
            }

            // Wait at the top
            yield return new WaitForSeconds(waitTime);

            // Move to the bottom
            while (transform.position.y > bottomY)
            {
                transform.position = new Vector3(transform.position.x, transform.position.y - speed * Time.deltaTime, transform.position.z);
                yield return null;
            }

            // Wait at the bottom
            yield return new WaitForSeconds(waitTime);
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("PlayerBlaster"))
        {
            if (!enemyHit) {
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

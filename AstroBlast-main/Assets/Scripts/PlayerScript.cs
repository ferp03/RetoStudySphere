using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class PlayerScript : MonoBehaviour
{
    public Rigidbody2D rb;
    public Animator animator;
    public GameObject blaster;
    public GameObject damage;
    public AudioSource SFX;
    public AudioClip hit;
    public AudioClip explosion;
    public float blasterSpeed = 10f;
    public float speed = 5f;
    string isTurningUp = "isTurningUp";
    string isTurningDown = "isTurningDown";
    private float attackTimer = 0.35f;
    private float attackCd = 0.25f;
    private bool canAttack = true;
    public int lives = 2;
    // Start is called before the first frame update
    

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();

        attackCd = attackTimer;

    }

    // Update is called once per frame
    void Update()
    {
        if ((Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow)) && rb.position.y < 4.3)
        {
            rb.velocity = new Vector2(0, speed);
            animator.SetBool(isTurningUp, true);
            animator.SetBool(isTurningDown, false);
        }
        else if ((Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow)) && rb.position.y > -4.5)
        {
            rb.velocity = new Vector2(0, -speed);
            animator.SetBool(isTurningDown, true);
            animator.SetBool(isTurningUp, false);
        }
        else if ((Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow)) && rb.position.x > -8)
        {
            rb.velocity = new Vector2(-speed, 0);

        }
        else if ((Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow)) && rb.position.x < 8)
        {
            rb.velocity = new Vector2(speed, 0);
        }
        
        else
        {
            rb.velocity = new Vector2(0, 0);
            animator.SetBool(isTurningUp, false);
            animator.SetBool(isTurningDown, false);
        }

        attackTimer += Time.deltaTime;
        if (attackTimer > attackCd) {
            canAttack = true;
        }

        if(Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.Mouse0) || Input.GetKeyDown(KeyCode.RightShift))
        {
            if (canAttack) {
                canAttack = false;
                attackTimer = 0;
                GameObject blasterClone = Instantiate(blaster, transform.position, transform.rotation);
                Rigidbody2D rb = blasterClone.GetComponent<Rigidbody2D>();

                rb.velocity = transform.right * blasterSpeed;
            }
        }
    }

    void OnTriggerEnter2D(Collider2D other)
    {   
        if (other.gameObject.CompareTag("EnemyBlaster") || other.gameObject.CompareTag("Asteroid"))
        {
            lives--;
            animator.SetBool("playerHit", true);
            damage.SetActive(true);

            if (lives == 0)
            {
                animator.SetBool("playerExplode", true);
                SFX.PlayOneShot(explosion);
                Destroy(gameObject, 0.5f);
                SceneManager.LoadScene("GameOver");
            }
        }

        if (other.gameObject.CompareTag("EnemyBlaster")) {
            SFX.PlayOneShot(hit);
        }

        if (other.gameObject.CompareTag("Asteroid")) {
            SFX.PlayOneShot(explosion);
        }
        
    }
}
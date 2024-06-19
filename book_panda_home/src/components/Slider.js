import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import styles from '../styles/Slider.module.css';


function Slider(){

    const [count,setCount] = useState(0);

    const next= ()=>{
        const items=document.getElementsByClassName( styles.slide_item );

        setCount(count+1);
        if(count === 4){
            for(let i =0 ;i<items.length;i++){
                items[i].setAttribute("style","left:0px");
            }
            setCount(0);
        }
        else{
            for(let i=0;i<items.length;i++){
                let now=items[i].style.left;//현재 위치
                if(now === ""){//현재 움직이지 않았다면
                    now=-1030;
                }
                else{
                    now=parseInt(now)-1030;
                }

                items[i].setAttribute("style","left:"+now+"px");
            }
        }



    }

    useEffect(
        ()=>{
           const interval= setInterval(next,5000);
            return  () =>{
                clearInterval(interval);
             } ;
        },[count]
    );



    return(
        <div className={ styles.slide }>
            <div className={ styles.slide_container}>
                <div className={styles.slide_item}>
                    <img src={process.env.PUBLIC_URL+ '/human.png'} alt='human'></img>
                </div>
                <div className={styles.slide_item}>
                    <img src={process.env.PUBLIC_URL+ '/stolen.png'} alt='stolen'/>
                </div>
                <div className={styles.slide_item}>
                    <img src={process.env.PUBLIC_URL+'/focus.png'} alt='focus'/>
                </div>
                <div className={styles.slide_item}>
                    <img src={process.env.PUBLIC_URL+'/almond.png'} alt='almond'/>
                </div>
                <div className={styles.slide_item}>
                    <img src={process.env.PUBLIC_URL+'/gun.png'} alt='gun'/>
                </div>
            </div>
        </div>
    )
}



export default Slider;
import Slider from '../components/Slider';
import styles from '../styles/Main.module.css';
import NewArrival from '../components/NewArrival';

function Main(){
    return(
        <div className={styles.container}>
            <Slider></Slider>
            <NewArrival></NewArrival>
            
        </div>
    )
}



export default Main;
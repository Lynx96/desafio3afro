import styles from './Header.module.scss'
import logoSvg from '../assets/logo.svg'

function Header(){
    return(
        <header className={styles.header}>
			<img src={logoSvg} alt="Logo da Afro Academy" />
		</header>
    )
}

export default Header
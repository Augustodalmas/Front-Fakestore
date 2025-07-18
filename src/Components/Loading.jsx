import style from './SCSS/Loading.module.scss'

export default function Loading(){
    return(
        <div className={style.content_loading}>
            <div className={style.loader}></div>
        </div>
    )
}
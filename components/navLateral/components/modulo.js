import styles from "./modulo.module.css";
import Link from "next/link";

function AnimationSubModulos(e){
    let x = HTMLElement;
    x=e.target;
    if(x.className==""){
      x  =  x.parentNode.parentNode.children[1];
    }else{
      x  =  x.parentNode.children[1];
    }
    
    if(x.style.visibility=="hidden"){
        let z =x.scrollHeight;
        x.style.height="auto"
        x.style.padding="0.5em 0 0.5em 50px"
        x.style.opacity="100%"
        x.style.visibility="visible"
    }else{
        x.style.height="0"
        x.style.padding="0 0 0 0"
        x.style.opacity="0%"
        x.style.visibility="hidden"
        //setTimeout(() => x.style.visibility="hidden",500)
        
    }
    

    
}

const SubModulos = ({dataSubModulos=[]}) => {
    if (dataSubModulos.tipo=="link") {
        return(
        <Link href={dataSubModulos.link}>
            <a>{dataSubModulos.subModuloName}</a>
        </Link>
        )

    }else{
        return ( 
            <div>
                
            </div>
         );
    }
    
}

const modulos = ({
  data = {
    modulo: "TituloModlo",
    svg:"account_box-black-18dp.svg",
    subModulos:[
        {
            tipo:"link",
            subModuloName:"",
            link:"#"
        },{
            tipo:"sub",
            subModuloName:"",
            subSubModulos:[
                {subSubModuloName:"",
                link:"#"}
            ]
        },
    ]
  }
}) => {
  return (
    <div>
      <div className={styles.NavLateralModulos} onClick={AnimationSubModulos} >
        <img src={"/resources/"+data.svg} />
        {data.modulo}
        <img src="/resources/keyboard_arrow_down-black-18dp.svg" />
      </div>
      <div className={styles.NavLateralSubModulos}>
        {data.subModulos.map((dataSubModulosInner) => (
          <SubModulos dataSubModulos={dataSubModulosInner} key={data.subModulos.indexOf(dataSubModulosInner)}/>
        ))}
      </div>
    </div>
  );
};



export default modulos;

 

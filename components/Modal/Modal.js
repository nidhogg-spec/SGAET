import styles from "./Modal.module.css";
import { MongoClient } from 'mongodb';
import react from "react";

export default function Modal (){
  //hooks 
  const [TipoModal, setTipoModal] = useState('');
  const [Data, setData] = useState({});
  const [Id, setId] = useState('');
  const [Coleccion, setColeccion] = useState('');
  const [Accion, setAccion] = useState('');

  
  function componentDidMount(){
    if(this.state.accion=="sin accion"){
  
    }
  }
  
  const getData = () =>{
    const jwtsecret= process.env.SECRET_KEY;
    const saltRounds=10;
    const url= process.env.MONGODB_URI
    const dbName= process.env.MONGODB_DB
  
    let client = new MongoClient(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect(e=>{
      let dbo=client.db(dbName);
      let collection = dbo.collection(this.state.coleccion)
  
      collection.findOne({idServicio: this.state.id},(err,result)=>{
        if(err){
            client.close()
            throw err
        }
        this.SetState({
          data:result
        })
        client.close()
      })
    })
  }
  return (
    <div
      id="myModalXD"
      className={styles.Modal}
      onClick={(event) => {
        let modal = document.getElementById("myModalXD");
        console.log(modal);
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }}
    >
      <div className={styles.Modal_content}></div>
    </div>
  );
}



// class Modal extends Component {
  
  
//   componentDidMount(){
//     if(this.state.accion=="sin accion"){

//     }
//   }



//   render() {
    
//   }
// }

// export default Modal;
// export default Modal = () => {

//   return (
//     <div id="myModalXD" className={styles.Modal} onClick={(event)=>{
//           let modal = document.getElementById("myModalXD");
//           console.log(modal)
//           if (event.target == modal) {
//             modal.style.display = "none";
//           }
//     }}>
//       <div className={styles.Modal_content}>

//       </div>
//     </div>
//   );
// };

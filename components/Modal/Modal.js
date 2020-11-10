import styles from "./Modal.module.css";
import { MongoClient } from 'mongodb';
import react from "react";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TipoModal:"error",
      data:{},
      id:"",
      coleccion:"",
      accion:"sin accion"
    };
  }
  getData = () =>{
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
  componentDidMount(){
    if(this.state.accion=="sin accion"){
      
    }
  }



  render() {
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
}

export default Modal;
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

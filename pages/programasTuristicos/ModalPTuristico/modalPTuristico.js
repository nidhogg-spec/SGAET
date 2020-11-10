export default function ModalPTuristico(props){
    const onClose = () => {
        props.show = false;
    };
    if(!props.show){
        return null
    } else{
        return(
            <div>
                <div>{props.children}</div>
                <div>
                    <button
                    onClose={e=>{
                        onClose()
                    }}>
                close
                    </button>
                </div>
            </div>
        )
    }
}
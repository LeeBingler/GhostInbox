export default function DeleteButton({deleteAccount}) {
    return (
        <button onClick={deleteAccount} style={{marginTop : "10px"}}>
            Delete account
        </button>
    )
}
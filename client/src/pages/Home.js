
export default function Home() {
    return (
        <>      
        <div >
        <h1>{`<>DevRooms</>`}</h1>
        <input placeholder='Username...' />

        <select >
          <option>-- Select Room --</option>
          <option value='javascript'>JavaScript</option>
          <option value='node'>Node</option>
          <option value='express'>Express</option>
          <option value='react'>React</option>
        </select>

        <button className='btn btn-secondary'>Join Room</button>
      </div></>
    )
}
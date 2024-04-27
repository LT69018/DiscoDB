import ListeningRow from "./ListeningRow.js";
import "./ListeningTable.css";

const ListeningTable = ({rows}) => {
  if (rows.length === 0) {
    console.log("[<ListeningTable/>] No rows to display. ");
    return <div></div>;
  }
  console.log("ListeningTable rows = ", rows);
  const rowsHTML = rows.map((row, index) => (
    <ListeningRow row={row} index={index}/>
  ));

  return (
    <div>
      {rowsHTML}
    </div>
  )
}

export default ListeningTable;
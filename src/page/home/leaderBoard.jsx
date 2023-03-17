import React from 'react'
import { Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

const LeaderBoard = ({open,closeLeaderBoard,dateState,getTime,data}) => {
    console.log("open",data.winPlayer?.['4-10']);
    return (
        <Modal show={open} onHide={()=>closeLeaderBoard()}  centered className="casino-popup">
            <Modal.Header closeButton>
                <Modal.Title className="text-dark">Leader Board</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p>Tournament table name : {data?.name}</p>
                    <p>Total Players : {data?.rooms?.filter((el) => el?.players)[0]?.players
                      ?.length || 0}</p>
                    <p>SB/BB : 100/200</p>
                    <p>Date : <span>{getTime(data?.tournamentDate)}</span></p>
                    <>
                  <div id="clockdiv">
                    <h4>
                      Days
                      <span class="days">{dateState?.days || "0"}</span>
                    </h4>
                    <h4>
                      Hours
                      <span class="hours">{dateState?.hours || "0"}</span>
                    </h4>
                  </div>
                  <div id="clockdiv">
                    <h4>
                      Minutes
                      <span class="minutes">{dateState?.minutes || "0"}</span>
                    </h4>
                    <h4>
                      Seconds
                      <span class="seconds">{dateState?.seconds || "0"}</span>
                    </h4>
                  </div>
                </>
                </div>
                <div className="leaderboard-table">
                     {data?.winPlayer?.first?.userId?<Table striped bordered hover variant="dark" responsive>
                        <thead>
                            <tr>
                                <th><p>Rank</p></th>
                                <th><p>Player</p></th>
                                <th><p>Chip won each hand</p></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.winPlayer?.first?.userId&&
                                <tr className='firstRank'>
                                <td ><p>1</p><Star /></td>
                                <td><p>{data?.winPlayer?.first?.userId?.username || 'To be decided'}</p></td>
                                <td><p>{data?.winPlayer?.first?.amount || 'To be decided'}</p></td>
                            </tr>}
                            {data?.winPlayer?.second?.userId&&
                                <tr className='secondRank myRank'>
                                <td ><p>2</p><Star /></td>
                                <td><p>{data?.winPlayer?.second?.userId?.username || 'To be decided'}</p></td>
                                <td><p>{data?.winPlayer?.second?.amount || 'To be decided'}</p></td>
                            </tr>
                            }
                            {data?.winPlayer?.third?.userId&&
                                <tr className='thirdRank'>
                                <td ><p>2</p><Star /></td>
                                <td><p>{data?.winPlayer?.third?.userId?.username || 'To be decided'}</p></td>
                                <td><p>{data?.winPlayer?.third?.amount || 'To be decided'}</p></td>
                            </tr>
                            }
                            {data.winPlayer?.['4-10'].userIds?.length>0 && data.winPlayer?.['4-10'].userIds?.map((fourP,i)=>(
                                <tr>
                                <td><p>{4+i}</p></td>
                                <td><p>{fourP?.username}</p></td>
                                <td><p>{data.winPlayer?.['4-10']?.amount}</p></td>
                            </tr>
                            ))}
                            {data.winPlayer?.['11-25'].userIds?.length>0 && data.winPlayer?.['4-10'].userIds?.map((elevenP,i)=>(
                                <tr>
                                <td><p>{11+i}</p></td>
                                <td><p>{elevenP?.username}</p></td>
                                <td><p>{data.winPlayer?.['11-25']?.amount}</p></td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>:''}           
                    
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default LeaderBoard


const Star = () => {
    return (
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.12 9.88005C21.0781 9.74719 20.9996 9.62884 20.8935 9.53862C20.7873 9.4484 20.6579 9.38997 20.52 9.37005L15.1 8.58005L12.67 3.67005C12.6008 3.55403 12.5027 3.45795 12.3853 3.39123C12.2678 3.32451 12.1351 3.28943 12 3.28943C11.8649 3.28943 11.7322 3.32451 11.6147 3.39123C11.4973 3.45795 11.3991 3.55403 11.33 3.67005L8.89999 8.58005L3.47999 9.37005C3.34211 9.38997 3.21266 9.4484 3.10652 9.53862C3.00038 9.62884 2.92186 9.74719 2.87999 9.88005C2.83529 10.0124 2.82846 10.1547 2.86027 10.2907C2.89207 10.4268 2.96124 10.5512 3.05999 10.6501L6.99999 14.4701L6.06999 19.8701C6.04642 20.0091 6.06199 20.1519 6.11497 20.2826C6.16796 20.4133 6.25625 20.5267 6.36999 20.6101C6.48391 20.6912 6.61825 20.7389 6.75785 20.7478C6.89746 20.7566 7.03675 20.7262 7.15999 20.6601L12 18.1101L16.85 20.6601C16.9573 20.7189 17.0776 20.7499 17.2 20.7501C17.3573 20.7482 17.5105 20.6995 17.64 20.6101C17.7537 20.5267 17.842 20.4133 17.895 20.2826C17.948 20.1519 17.9636 20.0091 17.94 19.8701L17 14.4701L20.93 10.6501C21.0305 10.5523 21.1015 10.4283 21.1351 10.2922C21.1687 10.1561 21.1634 10.0133 21.12 9.88005Z" fill="#000000" />
        </svg>
    )
}

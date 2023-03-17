/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { tournamentInstance } from '../../utils/axios.config';
import { getTime } from '../../utils/utils';
import Header from './header';

const LeaderBoard = ({data}) => {
    const url = new URLSearchParams(window.location.search);
    const [tournamentData,setTournamentData]=useState()
    const [dateState, setDateState] = useState();
    const getTournamentById=async()=>{
        try{
            if(url.get('tournamentId')){
                console.log("--->",url.get('tournamentId'))
                const res = await tournamentInstance().get(`/tournamentById`,{
                    params:{tournamentId:url.get('tournamentId')}
                })
                const {tournament}=res.data || {}
                if(tournament){
                    setTournamentData(tournament)
                }
            }
            
        }catch(err){
            console.log("Error Message Here---->",err)
        }
    }
    useEffect(()=>{
        getTournamentById()
    },[])
    if(tournamentData && tournamentData?.tournamentData){
        var x = setInterval(() => {
            let countDownDate = new Date(tournamentData?.tournamentData).getTime();
            var now = new Date().getTime();
            var distance = countDownDate - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setDateState({
              days,
              hours,
              minutes,
              seconds,
            });
            if (distance < 0) {
              clearInterval(x);
              setDateState({
                days: "0",
                hours: "0",
                minutes: "0",
                seconds: "0",
              });
            }
          }, 1000);
    }
    
    
    
    // console.log("open", data?.winPlayer?.['4-10']);
    
    return (
        <div className='leaderBoardPage'>
            <Header />
            <div className="container leaderBoardContainer">
                <div className='leaderBoardHeader'>
                    <h1>LEADERBOARD</h1>
                    <div className="tournamentDetails">
                        <div className="tournamentContent">
                            <p>Tournament table name : <span>{tournamentData?.name}</span></p>
                            <p>Total Players : <span>{tournamentData?.rooms?.filter((el) => el?.players)[0]?.players
                                ?.length || 0}</span></p>
                            <p>SB-BB : <span>{tournamentData?.levels?.smallBlind?.amount}-{tournamentData?.levels?.bigBlind?.amount}</span></p>
                            <p>Date : <span>{getTime(tournamentData?.tournamentDate)}</span></p>
                        </div>
                        <div className='tournamentTime'>
                            {tournamentData?.isFinished?<h2>Tournament Finished</h2>:tournamentData?.isStart?<h2>Tournament Is Running</h2>:
                            <>
                            <h2>Tournament Start Time </h2>
                            <div id="clockdiv">
                                <h4>
                                    Days :
                                    <span class="days">{dateState?.days || "0"}</span>
                                </h4>
                                <h4>
                                    Hours :
                                    <span class="hours">{dateState?.hours || "0"}</span>
                                </h4>
                            </div>
                            <div id="clockdiv">
                                <h4>
                                    Minutes :
                                    <span class="minutes">{dateState?.minutes || "0"}</span>
                                </h4>
                                <h4>
                                    Seconds :
                                    <span class="seconds">{dateState?.seconds || "0"}</span>
                                </h4>
                            </div>
                            </>
                            }
                        </div>
                    </div>
                </div>
                <div className="leaderboard-table">
                    {/* {data?.winPlayer?.first?.userId ?  */}
                    <Table striped bordered hover variant="dark" responsive>
                        <thead>
                            <tr>
                                <th><p>Rank</p></th>
                                <th><p>Player</p></th>
                                <th><p>Chip won each hand</p></th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr className='firstRank'>
                                    <td ><p>1</p><Star /></td>
                                    <td><p>{(tournamentData?.isFinished && tournamentData?.winPlayer?.first?.userId?.username)  || 'To be decided'}</p></td>
                                    <td><p>{(tournamentData?.isFinished && tournamentData?.winPlayer?.first?.amount) || 'To be decided'}</p></td>
                                </tr>
                                
                            
                                <tr className='secondRank myRank'>
                                    <td ><p>2</p><Star /></td>
                                    <td><p>{(tournamentData?.isFinished &&tournamentData?.winPlayer?.second?.userId?.username) || 'To be decided'}</p></td>
                                    <td><p>{(tournamentData?.isFinished &&tournamentData?.winPlayer?.second?.amount) || 'To be decided'}</p></td>
                                </tr>
                            
                           
                                <tr className='thirdRank'>
                                    <td ><p>3</p><Star /></td>
                                    <td><p>{(tournamentData?.isFinished &&tournamentData?.winPlayer?.third?.userId?.username) || 'To be decided'}</p></td>
                                    <td><p>{(tournamentData?.isFinished &&tournamentData?.winPlayer?.third?.amount) || 'To be decided'}</p></td>
                                </tr>
                          
                            {tournamentData?.winPlayer?.['4-10'].userIds?.length > 0 && tournamentData?.winPlayer?.['4-10'].userIds?.map((fourP, i) => (
                                <tr>
                                    <td><p>{4 + i}</p></td>
                                    <td><p>{(tournamentData?.isFinished&&fourP?.username) || 'To be decided'}</p></td>
                                    <td><p>{(tournamentData?.isFinished&&tournamentData?.winPlayer?.['4-10']?.amount) || 'To be decided'}</p></td>
                                </tr>
                            ))}
                            {tournamentData?.winPlayer?.['11-25'].userIds?.length > 0 && tournamentData?.winPlayer?.['4-10'].userIds?.map((elevenP, i) => (
                                <tr>
                                    <td><p>{11 + i}</p></td>
                                    <td><p>{(tournamentData?.isFinished&&elevenP?.username) || 'To be decided'}</p></td>
                                    <td><p>{(tournamentData?.isFinished&&tournamentData?.winPlayer?.['11-25']?.amount) || 'To be decided'}</p></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                </div>
            </div>
        </div>
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

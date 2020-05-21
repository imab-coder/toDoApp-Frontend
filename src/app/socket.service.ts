import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public url = "http://localhost:3000";
  public socket;

  constructor( public http: HttpClient ) {

    this.socket = io(this.url)
  }

   //events to be listen
   public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      });//end Socket

    });//end observable

  }//end verifyUser

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on('online-user-list', (userList) => {

        observer.next(userList);

      });//end Socket
  
    });//end observable

  }//end onlineUserList

  public disconnect = () => {

    return Observable.create((observer) => {

      this.socket.on('disconnect', () => {

        observer.next();

      });//end socket

    });//end observable

  }//end disconnect

  public listenAuthError = () => {
    return Observable.create((observer) => {
      this.socket.on('auth-error', (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } // end listenAuthError
    
  public getUpdatesFromUser = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } // end getUpdatesFromUser


  //* Events that are emitted *//


public setUser = (authToken) => {

  this.socket.emit('set-user', authToken);

} // end setUser


public notifyUpdates = (data) => {

  this.socket.emit('notify-updates', data);

}

public notifyUpdatesItem = (data) => {

  this.socket.emit('notify-updates-item', data);

}

public exitSocket = () =>{

  this.socket.disconnect();

}// end exit socket

public disconnectedSocket = () => {

    this.socket.emit("disconnect", "");//end Socket

}//end disconnectedSocket
}

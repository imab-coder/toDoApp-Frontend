import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public url = 'http://localhost:3000/api/v1'
  public logoutUrl= `${this.url}/users/logout`;


  constructor( public http: HttpClient) { }

  public signup(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('email', data.email)
      .set('password', data.password)
      .set('mobileNumber', data.mobileNumber)
      .set('countryName', data.CountryName)
    
      return this.http.post(`${this.url}/users/signup`, params)

  }

  public login(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.url}/users/login`, params) 
  }

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.logoutUrl}/${Cookie.get('userId')}`, params)
  }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }//end getlocalstorage function

  public codesz(): any {
    return this.http
  }

  public codes() {
    return this.http.get('assets/codes.json')
  }

  public countries(): any {
    return this.http.get('assets/countries.json');
  }

  public getAllList(userId,authToken): Observable<any> {
    
    return this.http.get(`${this.url}/lists/view/all/${userId}?authToken=${authToken}`);
  }//end getAllList function

  public getAllItems(listId,authToken): Observable<any> {
    
    return this.http.get(`${this.url}/items/view/all/${listId}?authToken=${authToken}`);
  }//end getAllItems function

  public addList(data): Observable<any>{

    const params = new HttpParams()
      .set('listName', data.listName)
      .set('listCreatorId', data.listCreatorId)
      .set('listCreatorName', data.listCreatorName)
      .set('listModifierId', data.listModifierId)
      .set('listModifierName', data.listModifierName)
      .set('listMode',data.listMode)
      .set('authToken',data.authToken)

    return this.http.post(`${this.url}/lists/addList`, params);
  }//end addList 

  public deleteList(data): Observable<any>{

    const params = new HttpParams()
      //.set('listId', data.listId)
      .set('authToken',data.authToken)

    return this.http.post(`${this.url}/lists/delete/${data.listId}`, params);
  }//end deleteList 

  public addItem(data): Observable<any>{

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('itemName', data.itemName)
      .set('itemCreatorId', data.itemCreatorId)
      .set('itemCreatorName', data.itemCreatorName)
      .set('itemModifierId', data.itemModifierId)
      .set('itemModifierName',data.itemModifierName)
      .set('authToken',data.authToken)

    return this.http.post(`${this.url}/items/addItem`, params);
  }//end addItem 

  public addHistory(data): Observable<any>{
    
    const params = new HttpParams()
      .set('listId', data.listId)
      .set('key', data.key)
      .set('itemId', data.itemId)
      .set('subItemId', data.subItemId)
      .set('authToken',data.authToken)
      
    return this.http.post(`${this.url}/history/addHistory`, params);
  }//end addItem 

  public getHistory(data): Observable<any>{
    
    const params = new HttpParams()
      .set('listId', data.listId)
      .set('authToken',data.authToken)

    return this.http.post(`${this.url}/history/deleteHistory`, params);
  }//end addItem 



  public addSubItem(data): Observable<any>{
    const params = new HttpParams()
      //.set('itemId', data.itemId)
      .set('subItemId', data.subItemId)
      .set('subItemName', data.subItemName)
      .set('subItemCreatorId', data.subItemCreatorId)
      .set('subItemCreatorName', data.subItemCreatorName)
      .set('subItemModifierId', data.subItemModifierId)
      .set('subItemModifierName',data.subItemModifierName)
      .set('authToken',data.authToken)

    return this.http.put(`${this.url}/items/addSubItem/${data.itemId}`, params);
  }//end addSubItem 

  public updateSubItem(data): Observable<any>{

    const params = new HttpParams()
      //.set('itemId', data.itemId)
      .set('subItemId', data.subItemId)
      .set('subItemName', data.subItemName)
      .set('subItemModifierId', data.subItemModifierId)
      .set('subItemModifierName',data.subItemModifierName)
      .set('subItemDone', data.subItemDone)
      .set('authToken',data.authToken)

    return this.http.put(`${this.url}/items/${data.itemId}/updateSubItem`, params);
  }//end updateSubItem 

  public updateItem(data): Observable<any>{
    const params = new HttpParams()
      //.set('itemId', data.itemId)
      .set('itemName', data.itemName)
      .set('itemModifierId', data.itemModifierId)
      .set('itemModifierName',data.itemModifierName)
      .set('itemDone',data.itemDone)
      .set('authToken',data.authToken)

    return this.http.put(`${this.url}/items/edititem/${data.itemId}`, params);
  }//end updateItem 

  public deleteItem(data): Observable<any>{

    const params = new HttpParams()
      //.set('itemId',data.itemId)
      .set('authToken',data.authToken)
      

    return this.http.post(`${this.url}/items/delete/${data.itemId}`, params);
  }//end deleteItem

  public deleteSubItem(data): Observable<any>{

    const params = new HttpParams()
      .set('subItemId', data.subItemId) 
      .set('authToken',data.authToken)

    return this.http.put(`${this.url}/items/deleteSubItem/${data.itemId}`, params);
  }//end deleteSubItem 


  public getAllPublicList(userId,authToken): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
    
    return this.http.post(`${this.url}/lists/view/all/public/lists?authToken=${authToken}`,params);
  }//end getAllSharedList function



  /*-----Friends------*/

  public sendFriendRequest(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('recieverId',data.recieverId)
      .set('recieverName',data.recieverName)
      .set('authToken',data.authToken)
      

    return this.http.post(`${this.url}/friends/send/friend/request`, params);
  }//end sendFriendRequest


  public rejectFriendRequest(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('recieverId',data.recieverId)
      .set('recieverName',data.recieverName)
      .set('authToken',data.authToken)
      

    return this.http.post(`${this.url}/friends/reject/friend/request`, params);
  }//end sendFriendRequest

  public cancelFriendRequest(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('recieverId',data.recieverId)
      .set('recieverName',data.recieverName)
      .set('authToken',data.authToken)
      

    return this.http.post(`${this.url}/friends/cancel/friend/request`, params);
  }//end sendFriendRequest


  public acceptFriendRequest(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('recieverId',data.recieverId)
      .set('recieverName',data.recieverName)
      .set('authToken',data.authToken)
      

    return this.http.post(`${this.url}/friends/accept/friend/request`, params);
  }//end sendFriendRequest


  // public unfriendUser(data): Observable<any>{

  //   const params = new HttpParams()
  //     .set('senderId',data.senderId)
  //     .set('senderName',data.senderName)
  //     .set('recieverId',data.recieverId)
  //     .set('recieverName',data.recieverName)
  //     .set('authToken',data.authToken)
      

  //   return this.http.post(`${this.url}/friends/unfriend/user`, params);
  // }//end sendFriendRequest



  public getAllUsers(authToken): Observable<any> {    
    return this.http.get(`${this.url}/users/view/all?authToken=${authToken}`);
  }//end getAllUsers function

  public getUserDetails(userId,authToken): Observable<any> {    
    return this.http.get(`${this.url}/users/${userId}/details?authToken=${authToken}`);
  }//end getUserDetails function




}




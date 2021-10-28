export interface Result {
    success: boolean,
    message: string;
    }
export class LocalStorageMember{
    
    //Register variable here
    returnUrl: string = 'returnUrl';
    userId: string = 'userId';

    //Add localStorage variable value
    add(key: string, value: string) {
        localStorage.setItem(key, value);
      }

    //Get localStorage variable value
    get(key: string): string {
        return localStorage.getItem(key);
      }

    //Clear registered variable here
    clear() {
        localStorage.removeItem(this.returnUrl);
        localStorage.removeItem(this.userId);
    }
}


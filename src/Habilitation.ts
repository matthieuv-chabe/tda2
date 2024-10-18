
export interface HabilitationResponseBeforeParsing {
    userId: number
    oId: string
    cliId: string
    sfAccountId: string
    email: string
    industry: string
    dispatch: string
    mobilePhone: string
    firstName: string
    lastName: string
    subAccounts: SubAccountBeforeParsing[]
    rights: string[]
    contactId: string
  }
  
  export interface SubAccountBeforeParsing {
    cliId: string
    dispatch: string
  }

  export interface HabilitationResponse {
    userId: number
    oId: string
    cliId: string
    sfAccountId: string
    email: string
    industry: string
    dispatch: string
    mobilePhone: string
    firstName: string
    lastName: string
    subAccounts: SubAccount[]
    rights: string[]
    contactId: string
  }
  
  export interface SubAccount {
    cliId: number
    dispatch: string
  }

export class Habilitation {

    public static parseHabilitationResponse(response:string): HabilitationResponse {
        const data = JSON.parse(response) as HabilitationResponseBeforeParsing;

        // cliId is a string in the response, but we want it to be a number
        //  however, if it's still a number, we ignore the entry altogether
        //  because it means it's not found in Waynium

        const subAccounts: SubAccount[] = data.subAccounts.map(subAccount => {
            const cliId = parseInt(subAccount.cliId);
            if (!isNaN(cliId) && subAccount.dispatch == "chabe") {
                return { cliId, dispatch: subAccount.dispatch };
            }
            return null;
        })
        .filter(subAccount => subAccount !== null) as SubAccount[];

        return {
            ...data,
            subAccounts
        }

    }

}

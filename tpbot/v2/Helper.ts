/*******************************************************************72*/
export abstract class Helper
/*******************************************************************72*/
{
static sleep(ms: number)
{
    return new Promise(res => setTimeout(res, ms));
}
/*******************************************************************72*/
}
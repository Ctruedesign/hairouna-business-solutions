import {monthlyUpdates} from './cra-updates.js';

export class CraMonthlyUpdates {
  constructor(ctx) {this.ctx=ctx;}
  async fetch(request) {
    return this.ctx.blockConcurrencyWhile(async () => {
      const saved = await this.ctx.storage.get('monthly-snapshot');
      // Visitors read saved results. Only initial setup or the monthly cron fetches CRA.
      const payload = request.method === 'POST' || !saved
        ? await monthlyUpdates(this.ctx.storage) : saved.payload;
      return Response.json(payload);
    });
  }
}
const store = env => env.CRA_MONTHLY.get(env.CRA_MONTHLY.idFromName('canadian-cra-monthly-v1'));
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if(url.pathname !== '/api/cra-updates') return env.ASSETS.fetch(request);
    if(request.method !== 'GET') return new Response('Method not allowed',{status:405,headers:{Allow:'GET'}});
    try {
      const response = await store(env).fetch('https://cra.internal/snapshot');
      return new Response(response.body,{status:response.status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff'}});
    } catch {
      return Response.json({status:'unavailable',checkedAt:null,sources:[],items:[]},{status:503,headers:{'Cache-Control':'no-store'}});
    }
  },
  async scheduled(_event, env) {await store(env).fetch('https://cra.internal/snapshot',{method:'POST'});},
};

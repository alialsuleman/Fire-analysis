calculate thing in path u, v :
dfs order, lca, with mo's or segtree

calculate thing in subtree :
dsu with heavy light

////////////////////////////
//		heavy_light_templete
///////////////////////////

const int N= 100001 ;
ll n, m ;
int color [N] ;

int a[N] ;
vector < int > g[N]  ;
ll siz[N] ;
vector < int > vertix[N] ;
vector < pair < int, int >>query[N]  ;
int ans [N] ;



void dfs_build(ll v, ll par)
{
       siz[v] = 1 ;
       for(auto u : g[v])
       {
              if(u == par)continue  ;
              dfs_build(u, v) ;
              siz[v] += siz[u] ;
       }
}

void add(ll v)
{



}
void dec(ll v)
{



}

ll getAns () {


}
void dfs( int node, int p, int master )
{

       ll mas = -1, mx = 0 ;
       for(auto x : g [node ])
       {
              if(x == p)continue  ;
              if(siz[x] > mx)
              {
                     mx = siz[x], mas = x  ;
              }
       }
       for(auto x : g[node])
       {
              if(x == p || x == mas )continue  ;
              dfs(x, node, 0) ;
       }
       if(mas != -1)
       {
              dfs(mas, node, 1) ;
              swap(vertix[node], vertix[mas]) ;
       }
       add(node) ;
       vertix[node].pb(node ) ;
       for(auto x : g [node])
       {
              if(x  == p || x  == mas) continue  ;
              for(auto xx : vertix[x ])
              {
                     add(xx) ;
                     vertix[node].pb(xx) ;
              }
       }

       for(auto u : query[node])
       {
              ans[u.S] = getAns ()  ;
       }


       if(!master)
       {
              for(auto u : vertix[node])
              {
                     dec(u) ;
              }
       }



}


int main ()
{

       ios::sync_with_stdio(0);
       cin.tie(0);
       cout.tie(0);

       cin >> n >> m ;
       for (int i=1 ; i<=n ; i++)cin >>a[i] ;
       for (int  i=0 ; i<n-1  ; i++)
       {
              int a, b ;
              cin >> a >>  b;
              g[a].pb(b) ;
              g[b].pb(a) ;
       }

       dfs_build(1, 0) ;
       for(ll i = 1 ; i <= m ; i++)
       {
           int a , b ;
              cin >> a  >> b ;
              query[a].pb({b, i}) ;
       }
       dfs(1, 0, 0) ;
       for(ll i = 1 ; i <= m ; i++)
       {
              cout << ans[i] << endl ;
       }

}




////////////////////////////
//		palindrome_depthx_of_v
///////////////////////////



const int N= 500100 ;
ll n, m ;
vector  < pair <ll, ll > > h[N] ;
ll  in[N], out[N];

vector < ll  > g[N] ;
string s ;
int timer =0  ;
ll mxD =0 ;
ll d[N] ;
void dfs( int node, int depth )
{
       d[node] = depth ;
       in[node]  = ++timer ;
       h[depth].push_back({timer, (1<<s[node]) }) ;
       for (auto x : g[node])
       {
              dfs( x, depth+1);
       }
       out[node]  = ++timer ;
       mxD = max (mxD, 1ll*depth);
}





//


int main ()
{


 ios::sync_with_stdio(0);cin.tie(0);cout.tie(0);
       cin >> n >> m ;
       bool jj=0 ;
       for (int i=0 ; i<n-1 ; i ++)
       {
              int pp ;
              if (pp== 2 )jj=1 ;
              cin >> pp ;
              g[pp].pb(i+2) ;
       }

       cin >> s ;
       s="#"+s ;

       for (int i=1 ; i<s.size() ; i++)s[i]-='a' ;

       dfs(1, 1 ) ;


       for (int i=1 ; i<= n ; i++)
       {
              h[i].push_back({0, 0 }) ;

              sort (h[i].begin(), h[i].end()) ;
              for(int  j=1  ;  j< h[i].size() ; j++)
              {
                     h[i][j].second ^= h[i][j-1].second ;
              }
       }


       while (m--)
       {
              int hi, v ;
              cin >> v >> hi ;
              if (hi < d[v])
              {
                     cout << "Yes\n" ;
                     continue  ;
              }
              //   cout << "\n" ;
              ll oo = 1e18 ;
              int l = lower_bound(h[hi].begin(), h[hi].end(), make_pair(in[v], -oo ) ) - h[hi].begin()  ;
              int r = lower_bound(h[hi].begin(), h[hi].end(), make_pair(out[v], -oo )) - h[hi].begin()  ;
              r-- ;
              l-- ;


              ll sum =  h[hi][r].second ^ h[hi][l].second ;
              ll y =  sum -  (sum &  -sum ) ;
              if (y ==0  )
              {
                     cout << "Yes\n" ;
              }
              else cout << "No\n" ;


              //cout << ans  ;
       }

}




////////////////////////////
//		mo'sInEdgeWithLca
///////////////////////////

 
const int N= 601000 ;
int n, m ;
vector < int > dfs_order, euler_tour ;
vector < pair < int, int > > g[N] ;
int in [N], out[N] ;

int timer = 0 ;
int comprse =1 ;
int answers[N] ;
int height[N] ;
int tt[N] ;
set < int > s ;
int a[N];


void dfs( int node, int p, int weight   )
{
       euler_tour.push_back(node);
       height[node] = weight;
       in [node] =  timer ++  ;
       dfs_order.push_back(node) ;
       for (auto  [x, c ] : g[node])
       {
              if (x == p) continue;
              a[x] = c ;
              dfs(x, node, weight + 1);
              euler_tour.push_back(node);
       }
       out [node] =  timer ++  ;
       dfs_order.push_back(node) ;
}







const int LOG = 20;
int nn  ;
struct SparseTable
{
       pair < int, int >   st[N][LOG];
       void build()
       {
              for(int j = 0; j < LOG; j++)
                     for(int i = 0; i < nn; i++) if(i + (1 << j) - 1 < nn)
                                   if (j ) st[i][j]  =min(st[i][j-1], st[i + (1 << (j-1))][j-1]) ;
                                   else st[i][j]  = make_pair(height[euler_tour[i]], euler_tour[i]) ;
       }
       int  query(int l,int r)
       {
              int x = log2(r-l+1);
              return min(st[l][x],st[r-(1<<x)+1][x]).second;
       }
} ST ;




long long curans =0;
int  how_acc [N];
int block_size;
void remov(int  node)
{

}
void add(int node)
{

}

int getAns ()
{
        return 100 ;
}
struct Query
{
       int l, r, idx, lca;
       bool operator<(Query other) const
       {
              return make_pair(l / block_size, r) <
                     make_pair(other.l / block_size, other.r);
       }
};

vector<Query> queries ;
void mo_s_algorithm()
{

       sort(queries.begin(), queries.end());
       int cur_l = 0;
       int cur_r = -1;
       for (Query q : queries)
       {
              while (cur_l > q.l)
              {
                     cur_l--;
                     add(cur_l);
              }
              while (cur_r < q.r)
              {
                     cur_r++;
                     add(cur_r);
              }
              while (cur_l < q.l)
              {
                     remov(cur_l);
                     cur_l++;
              }
              while (cur_r > q.r)
              {
                     remov(cur_r);
                     cur_r--;
              }

              answers[q.idx] =  getAns () ;
       }
}



int main ()
{

       ios::sync_with_stdio(0);
       cin.tie(0);
       cout.tie(0);

       cin >> n;


       int qq;
       cin >> qq ;

       for (int i=1 ; i<n ; i++)
       {
              int a, b, c;
              cin >> a >> b  >> c ;
              g[a].pb({b, c }) ;
              g[b].pb({a, c } );
       }



       dfs(1, 0, 1 ) ;
       block_size = sqrt(dfs_order.size()) +10;
       nn= euler_tour.size() ;

       ST.build() ;




       for (int i=0  ; i<qq ; i++)
       {
              int a, b ;
              cin >>a >> b;
              if (in[a]> in[b])swap(a,b) ;

              Query q;
              q.idx = i ;
              q.lca =  ST.query(in[a],in[b])  ;
              if (q.lca == a )
              {
                     q.l = in[a]+1 ;
                     q.r = in[b]  ;
              }
              else
              {
                     q.l = out[a] ;
                     q.r = in[b]  ;
              }
              queries.pb(q) ;

       }

       mo_s_algorithm() ;
       for (int i =0 ; i<queries.size() ; i++ )cout << answers[i] << "\n" ;


 
}





////////////////////////////
//		mo'sInNodeWithLca
///////////////////////////


#include <bits/stdc++.h>

#define mid (l+r)/2
#define F first
#define S second
#define pb push_back

using namespace std ;
const int N= 501000 ;
const int N2 =500001 ;
int n, m ;
int type [N2] ;
int num[N2] ;
vector < int > dfs_order, euler_tour ;
vector < int > g[N2] ;
int in [N2], out[N2] ;
int timer = 0 ;
int comprse =1 ;
long long freq_man[N2], freq_woman[N2]  ,  answers[N2];
int height[N2] ;
int tt[N2] ;

void dfs( int node, int p, int weight   )
{
       euler_tour.push_back(node);
       height[node] = weight;
       in [node] =  timer ++  ;
       dfs_order.push_back(node) ;

       for (auto  x : g[node])
       {
              if (x == p)
                     continue;
              dfs(x, node, weight + 1);
              euler_tour.push_back(node);

       }


       out [node] =  timer ++  ;
       dfs_order.push_back(node) ;
}







const int LOG = 20;
int nn  ;
struct SparseTable
{

       pair < int, int >   st[N][LOG];

       void build()
       {
              for(int j = 0; j < LOG; j++)
                     for(int i = 0; i < nn; i++) if(i + (1 << j) - 1 < nn)
                            {
                                   if (j )
                                   {
                                          st[i][j]  =min(st[i][j-1], st[i + (1 << (j-1))][j-1]) ;
                                   }
                                   else
                                   {
                                          st[i][j]  = make_pair(height[euler_tour[i]], euler_tour[i]) ;
                                   }
                            }


       }

       int  query(int l,int r)
       {
              int x = log2(r-l+1);
              return min(st[l][x],st[r-(1<<x)+1][x]).second;
       }
} ST ;



//    ios::sync_with_stdio(0);cin.tie(0);cout.tie(0);
long long curans =0;

void remov(int  ind)
{

       if (type[ind] == 1 )
       {
              freq_man[num[ind]]-- ;
              curans -=  freq_woman[num[ind]];
       }
       else
       {
              freq_woman[num[ind]]-- ;
              curans -=  freq_man[num[ind]];
       }

}
void add(int ind)
{
       if (type[ind] == 1 )
       {
              freq_man[num[ind]]++ ;
              curans +=  freq_woman[num[ind]];
       }
       else
       {
              freq_woman[num[ind]]++ ;
              curans +=  freq_man[num[ind]];
       }
}


void change_rv (int ind)
{
       int node  =  dfs_order[ind] ;
       tt[node] -- ;
       if (tt[node]==1 )
       {
              add(node) ;
       }
       else
       {
              remov(node) ;
       }

}
void change_ad ( int ind)
{
       int node  =  dfs_order[ind] ;
       tt[node] ++ ;
       if (tt[node]==1 )
       {
              add(node) ;
       }
       else
       {
              remov(node) ;
       }
}
long long  get_answer(  )
{
       int need = 0;
       return curans ;
}

int block_size;
struct Query
{
       int l, r, idx, lca;
       bool operator<(Query other) const
       {
              return make_pair(l / block_size, r) <
                     make_pair(other.l / block_size, other.r);
       }
};


vector<Query> queries ;

void mo_s_algorithm()
{

       sort(queries.begin(), queries.end());

       // TODO: initialize data structure

       int cur_l = 0;
       int cur_r = -1;
       // invariant: data structure wiint always reflect the range [cur_l, cur_r]
       for (Query q : queries)
       {
              while (cur_l > q.l)
              {
                     cur_l--;
                     change_ad(cur_l);
              }
              while (cur_r < q.r)
              {
                     cur_r++;
                     change_ad(cur_r);
              }
              while (cur_l < q.l)
              {
                     change_rv(cur_l);
                     cur_l++;
              }
              while (cur_r > q.r)
              {
                     change_rv(cur_r);
                     cur_r--;
              }

              answers[q.idx] = get_answer();
              if (q.lca)
              {
				  ->add(lca) ;
                 answers[q.idx] =  get_answer();
				  ->remove (lca) ;
              }
			  else answers[q.idx] = get_answer();
       }

}



int main ()
{

       cin >> n;
    
       for (int i=1 ; i<= n ; i++)
       {
              cin >> num[i] ;
       }


       for (int i=1 ; i<n ; i++)
       {
              int a, b ;
              cin >> a >> b ;
              g[a].pb(b) ;
              g[b].pb(a);
       }


       dfs(1, 0, 1 ) ;

       nn= euler_tour.size() ;
       
       ST.build() ;
       block_size = sqrt(dfs_order.size()) ;


       int qq;
       cin >> qq ;
       for (int i=0  ; i<qq ; i++)
       {
              int a, b ;
              cin >>a >> b;
              if (in[a]> in[b])swap(a,b) ;

              Query q;
              q.idx = i ;
              q.lca =  ST.query(in[a],in[b])  ;
              if (q.lca == a )
              {
                     q.l = in[a] ;
                     q.r = in[b] ;
                     q.lca =  0 ;
              }
              else
              {
                     q.l = out[a] ;
                     q.r = in[b] ;
              }
              queries.pb(q) ;

       }

        mo_s_algorithm() ;
        for (int i =0 ;i<queries.size() ; i++ )cout << answers[i] << "\n" ;

}



////////////////////////////
//		struct_LCA_O(1)
///////////////////////////

#include <bits/stdc++.h>

#define mid (l+r)/2
#define F first
#define S second
#define pb push_back

using namespace std ;
const int N = 400100;
const int LOG = 20;

int n, m ;


vector < int  > g[N] ;
vector < int > dfs_order ;

int in [N], out[N],  depth[N], timer =0  ;


struct LCA
{
       int sz=0 ;

       vector <long long > euler_tour ;
       pair < int, int >   st[N][LOG];

       void init ( )
       {

              dfs_lca(1, 0, 1 ) ;
              sz = euler_tour.size( ) ;
              build_lca() ;
       }
       void dfs_lca( int node, int p, int weight   )
       {

              in[node] = timer ++ ;
              dfs_order.push_back(node) ;
              euler_tour.push_back(node);
              depth[node] = weight;
              for (auto  x  : g[node])
              {
                     if (x == p) continue;
                     dfs_lca(x, node, weight + 1);
                     euler_tour.push_back(node);
              }
              out [node] = timer ++ ;
              dfs_order.push_back(node) ;
       }
       void build_lca()
       {
              for(int j = 0; j < LOG; j++)
                     for(int i = 0; i < sz; i++) if(i + (1 << j) - 1 < sz)
                                   if (j )st[i][j]  =min(st[i][j-1], st[i + (1 << (j-1))][j-1]) ;
                                   else st[i][j]  = make_pair(depth[euler_tour[i]], euler_tour[i]) ;
       }
       int  query(int l,int r)
       {
              if (in[l] > in[r])swap(l, r  ) ;
              l= in[l] ;
              r = in[r];
              int x = log2(r-l+1);
              return min(st[l][x],st[r-(1<<x)+1][x]).second;
       }
       int path(int u, int v)
       {
              return depth[u] + depth[v] - 2 * depth[query(u, v)];
       }
} lca;




int main()
{
       cin >> n  ;
       for (int i =0 ; i<n -1 ; i ++ )
       {
              int a, b ;
              cin >> a>> b ;
              g[a].pb(b) ;
              g[b].pb(a);
       }
       lca.init() ;
       while( true  )
       {

              int u, v;
              cin >> u>> v ;
              cout << lca.query(u, v) <<  " \n"  ;
              cout << lca.path(u, v) << " \n" ;


       }



////////////////////////////
//	 sqrt-optimization-example
///////////////////////////




#include <bits/stdc++.h>

#define mid (l+r)/2
#define F first
#define S second
#define pb push_back
#define ll long long
#define all(x)  (x.begin() , x.end())
using namespace std ;
const int N = 300100;
const int LOG = 18;
const int INF = 2000000000;
const ll LINF = 2000000000000000000;



int n, m,  K = 365;


vector < int  > g[N], d ;
vector < int > dfs_order ;
vector < bool > c ; // true : node is red
vector < int > added ; // for add change in block


int in [N], out[N],  depth[N], timer =0  ;


struct LCA
{
       int sz=0 ;

       vector <long long > euler_tour ;
       pair < int, int >   st[N][LOG];

       void init ( )
       {

              dfs_lca(1, 0, 1 ) ;
              sz = euler_tour.size( ) ;
              build_lca() ;
       }
       void dfs_lca( int node, int p, int weight   )
       {

              in[node] = timer ++ ;
              dfs_order.push_back(node) ;
              euler_tour.push_back(node);
              depth[node] = weight;
              for (auto  x  : g[node])
              {
                     if (x == p) continue;
                     dfs_lca(x, node, weight + 1);
                     euler_tour.push_back(node);
              }
              out [node] = timer ++ ;
              dfs_order.push_back(node) ;
       }
       void build_lca()
       {
              for(int j = 0; j < LOG; j++)
                     for(int i = 0; i < sz; i++) if(i + (1 << j) - 1 < sz)
                            {
                                   if (j )st[i][j]  =min(st[i][j-1], st[i + (1 << (j-1))][j-1]) ;
                                   else st[i][j]  = make_pair(depth[euler_tour[i]], euler_tour[i]) ;
                            }
       }
       int  query(int l,int r)
       {
              if (in[l] > in[r])swap(l, r  ) ;
              l= in[l] ;
              r = in[r];
              int x = log2(r-l+1);
              return min(st[l][x],st[r-(1<<x)+1][x]).second;
       }
       int path(int u, int v)
       {
              return depth[u] + depth[v] - 2 * depth[query(u, v)];
       }
} lca;


void rebuild()
{
       fill(d.begin(), d.end(), INF);
       queue<int>q;
       for (int v = 1; v <= n; v++)
              if (c[v])
              {
                     d[v] = 0;
                     q.push(v);
              }

       while (!q.empty())
       {
              int v = q.front();
              q.pop();
              for (int to : g[v])
                     if (d[v] + 1 < d[to])
                     {
                            d[to] = d[v] + 1;
                            q.push(to);
                     }
       }

}


int query(int v)
{
       int ans = d[v];
       for (int to : added)
              ans = min(ans, lca.path(v, to));
       return ans;
}

void solve()
{
       cin >> n>> m ;

       d = vector<int>(n+1,INF);
       c = vector<bool>(n+1);
       added.reserve(K+1);
       c[1] = true;

       for (int i = 0; i < n - 1; i++)
       {
              int u, v;
              cin >> u >> v ;
              g[u].pb(v);
              g[v].pb(u);
       }
       lca.init() ;
       int type, v;

       for (int i = 0; i < m; i++)
       {
              if (i%K == 0)
              {
                     rebuild();
                     added.clear();
              }
              cin  >>  type >>    v ;

              if (type == 1)
              {
                     added.pb(v);
                     c[v ] = true;
              }
              else cout << query(v) << "\n" ;
       }

}

int main()
{
       ios::sync_with_stdio(false);
       cin.tie(0);
       cout.tie(0);



       int tst = 1;
       //cin >> tst;
       while (tst--)
              solve();

}








////////////////////////////
//		sqrt-optimization-templete
///////////////////////////


#include <bits/stdc++.h>

#define mid (l+r)/2
#define F first
#define S second
#define pb push_back
#define ll long long
#define all(x)  (x.begin() , x.end())
using namespace std ;
const int N = 300100;
const int LOG = 18;
const int INF = 2000000000;
const ll LINF = 2000000000000000000;



int n, m,  K = 365;


vector < int  > g[N], d ;
vector < int > dfs_order ;
vector < bool > c ; // true : node is red
vector < int > added ; // for add change in block


int in [N], out[N],  depth[N], timer =0  ;


struct LCA
{
       int sz=0 ;

       vector <long long > euler_tour ;
       pair < int, int >   st[N][LOG];

       void init ( )
       {

              dfs_lca(1, 0, 1 ) ;
              sz = euler_tour.size( ) ;
              build_lca() ;
       }
       void dfs_lca( int node, int p, int weight   )
       {

              in[node] = timer ++ ;
              dfs_order.push_back(node) ;
              euler_tour.push_back(node);
              depth[node] = weight;
              for (auto  x  : g[node])
              {
                     if (x == p) continue;
                     dfs_lca(x, node, weight + 1);
                     euler_tour.push_back(node);
              }
              out [node] = timer ++ ;
              dfs_order.push_back(node) ;
       }
       void build_lca()
       {
              for(int j = 0; j < LOG; j++)
                     for(int i = 0; i < sz; i++) if(i + (1 << j) - 1 < sz)
                            {
                                   if (j )st[i][j]  =min(st[i][j-1], st[i + (1 << (j-1))][j-1]) ;
                                   else st[i][j]  = make_pair(depth[euler_tour[i]], euler_tour[i]) ;
                            }
       }
       int  query(int l,int r)
       {
              if (in[l] > in[r])swap(l, r  ) ;
              l= in[l] ;
              r = in[r];
              int x = log2(r-l+1);
              return min(st[l][x],st[r-(1<<x)+1][x]).second;
       }
       int path(int u, int v)
       {
              return depth[u] + depth[v] - 2 * depth[query(u, v)];
       }
} lca;


void rebuild()
{
       //rebuild the and array ;
}


int query(int v)
{
       int ans =  ?  ;
       for (int to : added)
             {
                 ans =  ? ; // something between node v and node to
             }
       return ans;
}

void solve()
{
       cin >> n>> m ;

       d = vector<int>(n+1,INF);
       c = vector<bool>(n+1);
       added.reserve(K+1);
       c[1] = true;

       for (int i = 0; i < n - 1; i++)
       {
              int u, v;
              cin >> u >> v ;
              g[u].pb(v);
              g[v].pb(u);
       }
       lca.init() ;
       int type, v;

       for (int i = 0; i < m; i++)
       {
              if (i%K == 0)
              {
                     rebuild();
                     added.clear();
              }
              cin  >>  type >>    v ;

              if (type == 1)
              {
                     added.pb(v);
                     c[v] = true;
              }
              else cout << query(v) << "\n" ;
       }

}





////////////////////////////
//		sqrt-optimization-templete
///////////////////////////

sparce table  : 
for dfs_order  size n*2  mminnnn n n  and the Log is  LOG2(2*N) minnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn

😭😭😭


#include <bits/stdc++.h>

#define mid (l+r)/2
#define F first
#define S second
#define pb push_back
#define ll long long
#define all(x)  (x.begin() , x.end())
using namespace std ;
const int N = 300100;
const int LOG = 18;
const int INF = 2000000000;
const ll LINF = 2000000000000000000;



int n, m,  K = 365;


vector < int  > g[N], d ;
vector < int > dfs_order ;
vector < bool > c ; // true : node is red
vector < int > added ; // for add change in block


int in [N], out[N],  depth[N], timer =0  ;


struct LCA
{
       int sz=0 ;

       vector <long long > euler_tour ;
       pair < int, int >   st[N][LOG];

       void init ( )
       {

              dfs_lca(1, 0, 1 ) ;
              sz = euler_tour.size( ) ;
              build_lca() ;
       }
       void dfs_lca( int node, int p, int weight   )
       {

              in[node] = timer ++ ;
              dfs_order.push_back(node) ;
              euler_tour.push_back(node);
              depth[node] = weight;
              for (auto  x  : g[node])
              {
                     if (x == p) continue;
                     dfs_lca(x, node, weight + 1);
                     euler_tour.push_back(node);
              }
              out [node] = timer ++ ;
              dfs_order.push_back(node) ;
       }
       void build_lca()
       {
              for(int j = 0; j < LOG; j++)
                     for(int i = 0; i < sz; i++) if(i + (1 << j) - 1 < sz)
                            {
                                   if (j )st[i][j]  =min(st[i][j-1], st[i + (1 << (j-1))][j-1]) ;
                                   else st[i][j]  = make_pair(depth[euler_tour[i]], euler_tour[i]) ;
                            }
       }
       int  query(int l,int r)
       {
              if (in[l] > in[r])swap(l, r  ) ;
              l= in[l] ;
              r = in[r];
              int x = log2(r-l+1);
              return min(st[l][x],st[r-(1<<x)+1][x]).second;
       }
       int path(int u, int v)
       {
              return depth[u] + depth[v] - 2 * depth[query(u, v)];
       }
} lca;


void rebuild()
{
       //rebuild the and array ;
}


int query(int v)
{
       int ans =  ?  ;
       for (int to : added)
             {
                 ans =  ? ; // something between node v and node to
             }
       return ans;
}

void solve()
{
       cin >> n>> m ;

       d = vector<int>(n+1,INF);
       c = vector<bool>(n+1);
       added.reserve(K+1);
       c[1] = true;

       for (int i = 0; i < n - 1; i++)
       {
              int u, v;
              cin >> u >> v ;
              g[u].pb(v);
              g[v].pb(u);
       }
       lca.init() ;
       int type, v;

       for (int i = 0; i < m; i++)
       {
              if (i%K == 0)
              {
                     rebuild();
                     added.clear();
              }
              cin  >>  type >>    v ;

              if (type == 1)
              {
                     added.pb(v);
                     c[v] = true;
              }
              else cout << query(v) << "\n" ;
       }

}





////////////////////////////
//		lca_mn_mx_or_sum_in_path
///////////////////////////
#include <bits/stdc++.h>
#define f first
#define s second
using namespace std;
#define int long long
#define ll long long
const int maxn = 2e5 + 69;
const int k = 19;
const int bits = 30;

vector<int> g[maxn];
int n, q, a[maxn], up[maxn][k], tin[maxn], tout[maxn], timer, d[maxn];


int oR[maxn][k];
int sum[maxn][k];
int mx[maxn][k];
int mn[maxn][k];


void dfs(int v, int p)
{
       tin[v] = ++timer;
       up[v][0] = p;
       oR[v][0] = a[p];
       sum[v][0] =  a[p] ;
       mx[v][0] =  a[p] ;
       mn[v][0] =  a[p] ;

       d[v] = d[p] + 1;
       sum[v][0] =  a[p] ;
       for (int i = 1; i < k; i++)
       {
              // for cal the LCA
              up[v][i] = up[up[v][i - 1]][i - 1];
              // here do some thing in this branch
              oR[v][i] = oR[v][i - 1] | oR[up[v][i - 1]][i - 1];
              sum[v][i] = sum[v][i - 1] + sum[up[v][i - 1]][i - 1];
              mx[v][i] =  max(mx[v][i - 1],  mx[up[v][i - 1]][i - 1]);
              mn[v][i] = min(mn[v][i - 1],  mn[up[v][i - 1]][i - 1]) ;
       }
       for (auto u : g[v])
       {
              if (u != p)
                     dfs(u, v);
       }
       tout[v] = timer;
}

bool is_anc(int u, int v)
{
       return tin[u] <= tin[v] && tout[u] >= tout[v];
}

int lca(int u, int v)
{
       if(is_anc(u, v))
              return u;
       else if(is_anc(v, u))
              return v;
       for (int i = k - 1; i >= 0; i--)
       {
              if (!is_anc(up[u][i], v) && up[u][i] > 0)
                     u = up[u][i];
       }
       return up[u][0];
}

int OR(int u, int dis)
{
       int res = a[u];
       for (int j = 0; j < bits; j++)
       {
              if (dis & (1 << j))
              {
                     res |= oR[u][j];
                     u = up[u][j];
              }
       }
       return res;
}
int SUM(ll u, ll dis)
{
       int res =  a[u] ;
       for (int j = 0; j < bits; j++)
       {
              if (dis & (1 << j))
              {
                     res += sum[u][j];
                     u = up[u][j];
              }
       }
       return res;
}
//
int MX (int u, int dis)
{
       int res = a[u];
       for (int j = 0; j < bits; j++)
       {
              if (dis & (1 << j))
              {
                     res = max(res,  mx[u][j] ) ;
                     u = up[u][j];
              }
       }
       return res;
}
//
int MN(int u, int dis)
{
       int res = a[u];
       for (int j = 0; j < bits; j++)
       {
              if (dis & (1 << j))
              {
                     res = min (res, mn[u][j]);
                     u = up[u][j];
              }
       }
       return res;
}

int Qry(int u, int v)
{
       int lc = lca(u, v);
       return OR(u, d[u] - d[lc]) | OR(v, d[v] - d[lc]);
}

signed main()
{
       int tt = 1;
       cin >> tt;
       while(tt--)
       {
              cin >> n;
              timer = 0;
              for (int i = 1; i <= n; i++)
                     g[i].clear();
              for (int i = 1; i <= n; i++)
                     cin >> a[i];
              for (int i = 1; i <= n - 1; i++)
              {
                     int x, y;
                     cin >> x >> y;
                     g[x].push_back(y);
                     g[y].push_back(x);
              }

              dfs(1, 0);
              int q ;
              cin >> q;
              while ( q-- )
              {
                     ll u,v ;
                     cin >> u >> v ;
                     int LCA = lca( u,v) ;
                     if (tin[u]> tin[v])swap(u, v );

                     ll dd = d[v] - d[LCA] ;
                     ll sum_u_v = SUM(v, dd   )  ;
                     if (u!= LCA ) sum_u_v += SUM( u, d[u] - d[LCA]-1) ;

                     ll mnn = MN ( v, dd) ;
                     mnn = min (mnn,MN (u, d[u] - d[LCA])  ) ;

                     ll mxx = MX ( v, dd) ;
                     mxx = max (mxx, MX (u, d[u] - d[LCA]) );


                     ll orrr =  OR ( v, dd) ;
                     orrr |=   OR (u, d[u] - d[LCA]) ;

                     cout << dd << "\n" ;
                     cout << LCA << " " << sum_u_v  <<  " " << mxx <<  " " << mnn << " " <<  orrr <<  " " << "\n" ;



              }



       }

       return 0;
}






////////////////////////////
//		trie prefix
///////////////////////////

#include <bits/stdc++.h>
#define MAXLEN ((int) 1e6)
using namespace std;

int n,  k ;
string s ;

int nCnt, sz[MAXLEN + 10], tot[MAXLEN + 10], ch[MAXLEN + 10][26];

/// tot [i]  - > number of substring start with i
/// sz [i]  - >  number of string end with  i
/// ch[now][i]  -> child i of node  'now'


int newNode()
{
       nCnt++;
       sz[nCnt] = tot[nCnt] = 0;
       memset(ch[nCnt], 0, sizeof(ch[nCnt]));
       return nCnt;
}
void add()
{
       int now = 1;
       tot[now]++;
       for (int i = 1; s[i]; i++)
       {
            //  cout << now <<  "\n" ;
              int &c = ch[now][s[i] - 'a'];
              if (!c) c = newNode();
              tot[now = c]++;
       }
       sz[now]++;

}

void solve()
{


       nCnt = 0;
       newNode();

        cin >> n >> k ;


       for (int i = 1; i <= n; i++)
       {
              cin >> s ;
              s= "#" + s ;
              add();
       }


       int now = 1;
       while (true)
       {
              int tot_here = sz[now] ; // number of string end here ;

              for (int i =0; i < 26 ; i++    )
              {
                     if ( tot [ch[now ][i ] ] )
                            tot_here++ ;// number of substring start here
              }


              if (tot_here >= k)
              {
                     if ( now == 1 )cout << "EMPTY\n" ;
                     else cout << "\n" ;
                     return  ;
              }


              for (int i=0 ; i<26 ; i++ )
              {

                     if ( tot [ch[now ][i ] ] )
                     {

                            tot_here =  tot_here  -1 + tot[ch[now ][i ]] ;

                            if (tot_here>= k )
                            {
                                   cout << char(i+'a')  ;
                                   k -=  tot_here  - tot[ch[now ][i ]]  ;
                                   now = ch[now ][i ] ;
                                   break ;
                            }

                     }
              }


       }
}

int main()
{
       int tcase;
       scanf("%d", &tcase);
       while (tcase--) solve();
       return 0;
}


int P = 37, int M= 1e9 + 9
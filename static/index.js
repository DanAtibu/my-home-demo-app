const { initializeApp, getDatabase, onValue, ref, set } = window.firebase; 

    const firebaseConfig = {
        apiKey: "AIzaSyAYyZiKiHWJWrW0egMF9xsNUq9Z5DDDkfg",
        authDomain: "myhome-a50ee.firebaseapp.com",
        projectId: "myhome-a50ee",
        storageBucket: "myhome-a50ee.appspot.com",
        messagingSenderId: "1085181640816",
        appId: "1:1085181640816:web:71f804e5694f6ccc4fb4b5"
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const root_url = "users/"

    window.Publisher = async function Publisher({ url= root_url, data= {} }) {
        return await set(ref(db, url), data ).then((res) => {
                return true;
            }).catch((er) => {
                console.log(er);
                return false
        });
    }

    
    window.GetData = function GetData({ url = root_url, call_back = () => {} }) {
        onValue( ref(db, url), call_back );
    };



function App() {
    return <React.Fragment>
        <Main />
    </React.Fragment>
};


function Main() {

    const [ data, setdata ] = React.useState({products: [], users: []});

    React.useEffect(() => {
        window.GetData({call_back: My_Data_From_Firebase})
    }, [])

    const My_Data_From_Firebase = ( shapshoot ) => {
        const data = shapshoot.val();
        const products = []
        const users = []
        for ( let user in data ) {
            user = data[ user ];
            let user_product = user.product || []
            let current_user_product = [];
            for ( let prd in user_product ) {
                const product = user.product[ prd ]
                products.unshift({ ...product, id: prd });
                current_user_product.unshift({ ...product, id: prd });
            }
            users.unshift({
                name: user.name,
                gmail: user.gmail,
                profile: user.profile,
                products: current_user_product
            });
        }

        console.log( users, products );
        setdata( () => ({ products: products.slice(0, 10) , users }));
    }



    return <React.Fragment>
        <Main_Header />
        <Body data={data} />
    </React.Fragment>
}

function Modal(props) {
    const Click = (e) => {
        e.preventDefault();
        console.log("Some one touch that modal !");
        props.close(e);
    };

    return <div className="modal flex" onClick={Click}>{ props.children }</div>
}

function FormCreateProduct() {
    const [ data , setdata ] = React.useState({});
    const buttonRef = React.useRef();

    const Click = ( e ) => {
        e.preventDefault();
        const id = `${Math.floor(Math.random() * 1000000)}${Date.now()}`
        buttonRef.current.classList.add("loading");
        const res = window.Publisher({url: `users/public/product/${id}`, data });
        if ( !res ) alert("Produit Non Enregistrer !");
        else alert( "Produit Enregistrer." );
        buttonRef.current.classList.remove("loading");
    }; 

    const Change = (e) => {
        let { name, value} = e.target;
        setdata( state => ({ ...state, [ name ] : value }))
    }
    
    
    console.log( data );
    return <form id="form_create_product" autoComplete="off" className="flex" onChange={Change} onSubmit={Click}>
        <input name="addresse" placeholder="Product Addresse" />
        <input name="price" type="number" placeholder="Product Price"/>
        <input name="img" placeholder="Product Url Image." />
        <input name="detail" placeholder="Product Detail" />
        <button className="" ref={buttonRef}> Enregister </button>
    </form>
}


function Main_Header() {

    const [ form_open, setform_open ] = React.useState(false);
    const toogle_form = () => {
        setform_open( state => !state );
    };

  return (
    <section id='main_header'>
        {
            form_open && <FormCreateProduct />
        }
        <div id="navbar" className='flex'>
            <h3>donexa<span>!</span>com</h3>
            <div id="navbar_util">
                <i className="fas fa-edit" onClick={toogle_form}></i>
            </div>
        </div>
        <div id="content_form"></div>
    </section>
  )
}

class Body extends React.Component {
    render() {
    
    if ( this.props.data.products.length === 0 && this.props.data.users.length === 0 ) {
        return <div className="prev_loading flex"> <div></div> </div>
    }
    
    
    return (
      <section id="body_section">
            <CompanyList companies={this.props.data.users} />
            <ProductList products={this.props.data.products} />
      </section>
    )
  }
}

class CompanyList extends React.Component {
    render () {
        return <div id="CompanyList" className="flex">
            { this.props.companies.map( company => <Company key={company.gmail} data={company} /> ) }
        </div>
    }
}

class ProductList extends React.Component {
    render () {
        return <div id="ProductList" className="flex">
            { this.props.products.map( product => <Product key={product.id} data={product} /> ) }
        </div>
    }
}

function Product(props) {
    let {img, addresse, price, detail} = props.data;
    return <div className="product">
        <img src={img} />
        <div className="product_detail">
            <div className="product_more_detail">
                <p>{addresse}</p>
                <p>{detail}</p>
            </div>
            <div className="product_divers flex">
                <p className="product_price"> ${price} </p>
                <button>Buy</button>
            </div>
        </div>
    </div>
}

function DetailCompany(props) {
    return <div className="detail_company" onClick={ e => {
        e.preventDefault();
    }}> 

        <p className="detail_company_name">{props.data.name}</p>
        <div className="detail_company_product">
            { props.data.products.map( item => <div key={item.id} className="company_products">
                <div className="company_products_detail flex">
                    <img src={item.img} />
                    <p>{item.price}</p>
                    <p>{item.addresse}</p>
                </div>
                <div>{ item.detail }</div>
            </div> ) }
        </div>
    </div>
}


function Company( props ) {
    const [ modal_is_open , setmodal_is_open ] = React.useState(false);
    let {name, gmail, profile} = props.data;

    const Click = (e) => {
        e.preventDefault();
        setmodal_is_open( state => {
            return !state;
        } );
    };

    return <div className="company flex">
        {
            modal_is_open && <Modal close={Click}>
                <DetailCompany data={props.data} />
            </Modal>
        }
        <img src={profile} className="company_logo" />
        <p className="company_name">{name}</p>
        <p className="company_email">{gmail}</p>
        <button className="company_contact" onClick={Click}>More</button>
    </div>
}

ReactDOM.render( <App />, document.getElementById("my_app") );

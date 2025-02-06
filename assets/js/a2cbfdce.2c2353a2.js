"use strict";(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[29459],{15680:(e,t,n)=>{n.d(t,{xA:()=>p,yg:()=>y});var r=n(96540);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),i=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=i(e.components);return r.createElement(u.Provider,{value:t},e.children)},c="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=i(n),d=o,y=c["".concat(u,".").concat(d)]||c[d]||g[d]||a;return n?r.createElement(y,s(s({ref:t},p),{},{components:n})):r.createElement(y,s({ref:t},p))}));function y(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,s=new Array(a);s[0]=d;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[c]="string"==typeof e?e:o,s[1]=l;for(var i=2;i<a;i++)s[i]=n[i];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},97673:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>u,default:()=>y,frontMatter:()=>l,metadata:()=>i,toc:()=>c});n(96540);var r=n(15680);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}const l={title:"Deploying to Azure",sidebar_label:"Deploying to Azure",slug:"/deploy/azure",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/deploy/azure.md"},u="Azure setup guide",i={unversionedId:"docs/deploy/azure",id:"version-0.15.0/docs/deploy/azure",title:"Deploying to Azure",description:"The following is a set of instructions to quickstart DataHub on Azure Kubernetes Service (AKS). Note, the guide",source:"@site/versioned_docs/version-0.15.0/docs/deploy/azure.md",sourceDirName:"docs/deploy",slug:"/deploy/azure",permalink:"/docs/0.15.0/deploy/azure",draft:!1,editUrl:"https://github.com/datahub-project/datahub/blob/master/docs/deploy/azure.md",tags:[],version:"0.15.0",frontMatter:{title:"Deploying to Azure",sidebar_label:"Deploying to Azure",slug:"/deploy/azure",custom_edit_url:"https://github.com/datahub-project/datahub/blob/master/docs/deploy/azure.md"},sidebar:"overviewSidebar",previous:{title:"Deploying to GCP",permalink:"/docs/0.15.0/deploy/gcp"},next:{title:"Deploying with Docker",permalink:"/docs/0.15.0/docker"}},p={},c=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Start up a Kubernetes cluster on AKS",id:"start-up-a-kubernetes-cluster-on-aks",level:2},{value:"Setup DataHub using Helm",id:"setup-datahub-using-helm",level:2},{value:"Expose endpoints using a load balancer",id:"expose-endpoints-using-a-load-balancer",level:2},{value:"Use PostgresSQL for the storage layer",id:"use-postgressql-for-the-storage-layer",level:2}],g={toc:c},d="wrapper";function y(e){var{components:t}=e,n=s(e,["components"]);return(0,r.yg)(d,a(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){o(e,t,n[t])}))}return e}({},g,n),{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"azure-setup-guide"},"Azure setup guide"),(0,r.yg)("p",null,"The following is a set of instructions to quickstart DataHub on Azure Kubernetes Service (AKS). Note, the guide\nassumes that you do not have a Kubernetes cluster set up. "),(0,r.yg)("h2",{id:"prerequisites"},"Prerequisites"),(0,r.yg)("p",null,"This guide requires the following tools:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://kubernetes.io/docs/tasks/tools/"},"kubectl")," to manage Kubernetes resources"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://helm.sh/docs/intro/install/"},"helm")," to deploy the resources based on helm charts. Note, we only support Helm\n3."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://learn.microsoft.com/en-us/cli/azure/install-azure-cli"},"AZ CLI")," to manage Azure resources")),(0,r.yg)("p",null,"To use the above tools, you need to set up Azure credentials by following\nthis ",(0,r.yg)("a",{parentName:"p",href:"https://learn.microsoft.com/en-us/cli/azure/authenticate-azure-cli"},"guide"),"."),(0,r.yg)("h2",{id:"start-up-a-kubernetes-cluster-on-aks"},"Start up a Kubernetes cluster on AKS"),(0,r.yg)("p",null,"You can follow this ",(0,r.yg)("a",{parentName:"p",href:"https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli"},"guide")," to create a new\ncluster using az cli. "),(0,r.yg)("p",null,"Note: you can skip the application deployment step since we are deploying DataHub instead. If you are deploying DataHub to an existing cluster, please\nskip the corresponding sections."),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Verify you have the Microsoft.OperationsManagement and Microsoft.OperationalInsights providers registered on your subscription. These Azure resource providers are required to support Container insights. Check the registration status using the following commands:")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"az provider show -n Microsoft.OperationsManagement -o table\naz provider show -n Microsoft.OperationalInsights -o table\n")),(0,r.yg)("p",null,"If they're not registered, register them using the following commands:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"az provider register --namespace Microsoft.OperationsManagement\naz provider register --namespace Microsoft.OperationalInsights\n")),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Create a resource group. Change name, location to your choosing.")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"az group create --name myResourceGroup --location eastus\n")),(0,r.yg)("p",null,"The following output indicates that the command execution was successful:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},'{\n  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",\n  "location": "eastus",\n  "managedBy": null,\n  "name": "myResourceGroup",\n  "properties": {\n    "provisioningState": "Succeeded"\n  },\n  "tags": null\n}\n')),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Create an AKS Cluster. For this project, it is best to increase node count to at least 3. Change cluster name, node count, and addons to your choosing.")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"az aks create -g myResourceGroup -n myAKSCluster --enable-managed-identity --node-count 3 --enable-addons monitoring --generate-ssh-keys\n")),(0,r.yg)("p",null,"After a few minutes, the command completes and returns JSON-formatted information about the cluster."),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Connect to the cluster")),(0,r.yg)("p",null,"Configure kubectl to connect to your Kubernetes cluster using the az aks get-credentials command."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"az aks get-credentials --resource-group myResourceGroup --name myAKSCluster\n")),(0,r.yg)("p",null,"Verify the connection to your cluster using the ",(0,r.yg)("inlineCode",{parentName:"p"},"kubectl get")," command. This command returns a list of the cluster nodes."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"kubectl get nodes\n")),(0,r.yg)("p",null,"You should get results like below. Make sure node status is Ready."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"NAME                                          STATUS   ROLES    AGE   VERSION\naks-nodepool1-37660971-vmss000000              Ready    agent   24h   v1.25.6\naks-nodepool1-37660971-vmss000001              Ready    agent   24h   v1.25.6\naks-nodepool1-37660971-vmss000002              Ready    agent   24h   v1.25.6\n")),(0,r.yg)("h2",{id:"setup-datahub-using-helm"},"Setup DataHub using Helm"),(0,r.yg)("p",null,"Once the Kubernetes cluster has been set up, you can deploy DataHub and its prerequisites using helm. Please follow the\nsteps in this ",(0,r.yg)("a",{parentName:"p",href:"/docs/0.15.0/deploy/kubernetes"},"guide"),". "),(0,r.yg)("p",null,"Notes:\nSince we are using PostgreSQL as the storage layer, change postgresql enabled to true and mysql to false in the values.yaml file of prerequisites.\nAdditionally, create a postgresql secret. Make sure to include 3 passwords for the postgresql secret: postgres-password, replication-password, and password."),(0,r.yg)("h2",{id:"expose-endpoints-using-a-load-balancer"},"Expose endpoints using a load balancer"),(0,r.yg)("p",null,"Now that all the pods are up and running, you need to expose the datahub-frontend end point by setting\nup ",(0,r.yg)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/services-networking/ingress/"},"ingress"),". To do this, you need to first set up an\ningress controller. "),(0,r.yg)("p",null,"There are many ",(0,r.yg)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/"},"ingress controllers"),"  to choose\nfrom, but here, we will follow this ",(0,r.yg)("a",{parentName:"p",href:"https://learn.microsoft.com/en-us/azure/application-gateway/tutorial-ingress-controller-add-on-existing"},"guide")," to set up the Azure\nApplication Gateway Ingress Controller. "),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Deploy a New Application Gateway.")),(0,r.yg)("p",null,"First, you need to create a WAF policy"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"az network application-gateway waf-policy create -g myResourceGroup -n myWAFPolicy\n")),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Before the application gateway can be deployed, you'll also need to create a public IP resource, a new virtual network with address space 10.0.0.0/16, and a subnet with address space 10.0.0.0/24.\nThen, you can deploy your application gateway in the subnet using the publicIP.")),(0,r.yg)("p",null,"Caution: When you use an AKS cluster and application gateway in separate virtual networks, the address spaces of the two virtual networks must not overlap. The default address space that an AKS cluster deploys in is 10.224.0.0/12."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"az network public-ip create -n myPublicIp -g myResourceGroup --allocation-method Static --sku Standard\naz network vnet create -n myVnet -g myResourceGroup --address-prefix 10.0.0.0/16 --subnet-name mySubnet --subnet-prefix 10.0.0.0/24 \naz network application-gateway create -n myApplicationGateway -l eastus -g myResourceGroup --sku WAF_v2 --public-ip-address myPublicIp --vnet-name myVnet --subnet mySubnet --priority 100 --waf-policy /subscriptions/{subscription_id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/myWAFPolicy\n")),(0,r.yg)("p",null,"Change myPublicIp, myResourceGroup, myVnet, mySubnet, and myApplicationGateway to names of your choosing."),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Enable the AGIC Add-On in Existing AKS Cluster Through Azure CLI")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},'appgwId=$(az network application-gateway show -n myApplicationGateway -g myResourceGroup -o tsv --query "id") \naz aks enable-addons -n myCluster -g myResourceGroup -a ingress-appgw --appgw-id $appgwId\n')),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Peer the Two Virtual Networks Together")),(0,r.yg)("p",null,"Since you deployed the AKS cluster in its own virtual network and the Application gateway in another virtual network, you'll need to peer the two virtual networks together in order for traffic to flow from the Application gateway to the pods in the cluster."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},'nodeResourceGroup=$(az aks show -n myCluster -g myResourceGroup -o tsv --query "nodeResourceGroup")\naksVnetName=$(az network vnet list -g $nodeResourceGroup -o tsv --query "[0].name")\n\naksVnetId=$(az network vnet show -n $aksVnetName -g $nodeResourceGroup -o tsv --query "id")\naz network vnet peering create -n AppGWtoAKSVnetPeering -g myResourceGroup --vnet-name myVnet --remote-vnet $aksVnetId --allow-vnet-access\n\nappGWVnetId=$(az network vnet show -n myVnet -g myResourceGroup -o tsv --query "id")\naz network vnet peering create -n AKStoAppGWVnetPeering -g $nodeResourceGroup --vnet-name $aksVnetName --remote-vnet $appGWVnetId --allow-vnet-access\n')),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Deploy the Ingress on the Frontend Pod")),(0,r.yg)("p",null,"In order to use the ingress controller to expose frontend pod, we need to update the datahub-frontend section of the values.yaml file that was used to deploy DataHub. Here is a sample configuration:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},'datahub-frontend:\n  enabled: true\n  image:\n    repository: acryldata/datahub-frontend-react\n    # tag: "v0.10.0 # defaults to .global.datahub.version\n\n  # Set up ingress to expose react front-end\n  ingress:\n    enabled: true\n    annotations:\n      kubernetes.io/ingress.class: azure/application-gateway\n      appgw.ingress.kubernetes.io/backend-protocol: "http" \n    \n    hosts:\n    - paths:\n      - /*\n  defaultUserCredentials: {}\n')),(0,r.yg)("p",null,"You can then apply the updates:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"helm upgrade --install datahub datahub/datahub --values values.yaml\n")),(0,r.yg)("p",null,"You can now verify that the ingress was created correctly"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"kubectl get ingress\n")),(0,r.yg)("p",null,"You should see a result like this:"),(0,r.yg)("p",null,(0,r.yg)("img",{parentName:"p",src:"https://github.com/Saketh-Mahesh/azure-docs-images/blob/main/frontend-status.png?raw=true",alt:"frontend-image"})),(0,r.yg)("h2",{id:"use-postgressql-for-the-storage-layer"},"Use PostgresSQL for the storage layer"),(0,r.yg)("p",null,"Configure a PostgreSQL database in the same virtual network as the Kubernetes cluster or implement virtual network peering to connect both networks. Once the database is provisioned, you should be able to see the following page under the Connect tab on the left side. "),(0,r.yg)("p",null,"Note: PostgreSQL Database MUST be deployed in same location as AKS/resource group (eastus, centralus, etc.)\nTake a note of the connection details:"),(0,r.yg)("p",null,(0,r.yg)("img",{parentName:"p",src:"https://github.com/Saketh-Mahesh/azure-docs-images/blob/main/postgres-info.png?raw=true",alt:"postgres-info"})),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Update the postgresql settings under global in the values.yaml as follows.")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},'global:\n  sql:\n    datasource:\n      host: "${POSTGRES_HOST}.postgres.database.azure.com:5432"\n      hostForpostgresqlClient: "${POSTGRES_HOST}.postgres.database.azure.com"\n      port: "5432"\n      url: "jdbc:postgresql://${POSTGRES_HOST}.postgres.database.azure.com:5432/datahub?user=${POSTGRES_ADMIN_LOGIN}&password=${POSTGRES_ADMIN_PASSWORD}&sslmode=require"\n      driver: "org.postgresql.Driver"\n      username: "${POSTGRES_ADMIN_LOGIN}"\n      password:\n        value: "${POSTGRES_ADMIN_PASSWORD}"\n')),(0,r.yg)("p",null,"Run this command helm command to update datahub configuration"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"helm upgrade --install datahub datahub/datahub --values values.yaml\n")),(0,r.yg)("p",null,"And there you go! You have now installed DataHub on an Azure Kubernetes Cluster with an ingress controller set up to expose the frontend. Additionally you have utilized PostgreSQL as the storage layer of DataHub."))}y.isMDXComponent=!0}}]);
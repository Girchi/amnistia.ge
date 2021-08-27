
function statusChanger(status, toSomething){
    const statuses = {
        ადვოკატი: "lawyer",
        პატიმარი: "prisoner",
        ქომაგი: "supporter",
        დამფუძნებელი: "founder",
        ინვესტორი: "investor",
        ოქროს_ინვესტორი: "golden investor"
      }

    if(toSomething === 'class'){
        return statuses[status.replace(" ", "_")].replace(" ", "")
    } else if (toSomething === 'lang') {
        return statuses[status.replace(" ", "_")]
    } else {
        return status.replace('_', ' ')
    }
}

export default statusChanger
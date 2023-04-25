const fetch = require("node-fetch");
const Discord = require("discord.js");
const config = require("./config.json");
const Client = new Discord.Client({intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent
]});

const token = config.token
Client.login(token);

Client.on("ready", () => {
    console.log("Ready to work");
});

Client.on("interactionCreate" , async (button) => {
    if (!button.isButton()) return;

    if (button.customId === "Crypto"){

        const emojisIDs = ["1096808873874169876",undefined,"1096811409616142376","1096817306048397464","1096817290508501093","1096817346351464508"];  // here are the IDs of the emojis
        let counter = -1;

        const paiements = ["PayPal","Crypto","Cash App"]
        const buttons = paiements.map(element => {
            counter ++
            return new Discord.ButtonBuilder()
            .setCustomId(element)
            .setLabel(element)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setDisabled(true)
            .setEmoji({
                id : emojisIDs[counter]
            })
        })

        const newButtonsRow = new Discord.ActionRowBuilder()
        .addComponents(buttons)

        const crypto = ["Bitcoin", "Litecoin" , "Ethereum"]

        const cryptoButtons = crypto.map((crypto) => {
            counter++
            return new Discord.ButtonBuilder()
            .setCustomId(crypto)
            .setLabel(crypto)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji({
                id : emojisIDs[counter]
            })
        })

        const cryptoRow = new Discord.ActionRowBuilder()
        .addComponents(cryptoButtons)

        const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name : "Crypto",
            iconURL : Client.user.avatarURL()
        })
        .setColor("Blue")
        .setDescription('In which cryptocurrency would you like to pay?\nPlease choose between **Bitcoin**, **Litecoin** and  **Ethereum**.')

        button.message.edit({components : [newButtonsRow]})

        await button.reply("You chose the crypto payment method")

        button.message.channel.send({
            embeds : [embed],
            components : [cryptoRow]
        })
    }

    if (button.customId.startsWith('confirm')){
        if (button.member.roles.cache.has("1097209275530608640")){
            button.reply("The payment has been confirmed by a moderator :white_check_mark:")

            const customer = button.customId.split("_")[1];

            button.message.guild.channels.cache.get(button.customId.split("_")[2]).send(`<@${customer}>,\nyour payment has been confirmed by a moderator :white_check_mark:`)

            const newButton = new Discord.ButtonBuilder()
            .setCustomId("confirm")
            .setLabel("confirm the payment")
            .setStyle(Discord.ButtonStyle.Success)
            .setDisabled(true)

            const newRow = new Discord.ActionRowBuilder()
            .addComponents([newButton])

            button.message.edit({
                components : [newRow]
            })

            const customerRole = "1097209378756624486";  // here replace the ID by the ID of your customer role
            await button.guild.members.fetch();
            button.guild.members.cache.get(customer).roles.add(customerRole);

        }else{
            button.reply("Only moderators can confirm the payment :x:")
        }
    }

    if (button.customId === 'payed') {
        const moderatorRole = await button.message.guild.roles.fetch("1097209275530608640"); // replace the ID in the "..." by the ID of your moderator role

        button.message.components[0].components[0].data.disabled = true;

        button.message.edit({
            components: button.message.components
        })

        const confirm = new Discord.ButtonBuilder()
        .setCustomId(`confirm_${button.user.id}_${button.message.channel.id}`)
        .setLabel('confirm the payment')
        .setStyle(Discord.ButtonStyle.Success)

        const confirmRow = new Discord.ActionRowBuilder()
        .addComponents([confirm])

        await button.reply(`Thank you for purchasing InfiniteCore!\nA ${moderatorRole} will be available soon to provide you your InfiniteCore Access-Key.\nPlease only contact staff members via DM if you haven’t gotten an answer within 24 hours.`);
        button.message.guild.channels.cache.get("1097787978094485544").send({      // Here replace the ID in the get method by the ID of the channel where moderators will confirm the payments
            content : `Please confirm that **${button.user.username}** payed`,
            components : [confirmRow]
        })
    }
    if (button.customId === 'Bitcoin'){

        const emojisIDs = ["1096817306048397464","1096817290508501093","1096817346351464508"]; // here are the IDs of the emojis

        let counter = -1;

        const crypto = ["Bitcoin", "Litecoin" , "Ethereum"]

        const cryptoButtons = crypto.map((crypto) => {
            counter++
            return new Discord.ButtonBuilder()
            .setCustomId(crypto)
            .setLabel(crypto)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setDisabled(true)
            .setEmoji({
                id : emojisIDs[counter]
            })
        })

        const newCryptoRow = new Discord.ActionRowBuilder()
        .addComponents(cryptoButtons)

        const res = await fetch("https://cryptoast.fr/api/json/cmc-price-predict-token-list.php");
        const arrayCrypto = await res.json();
        const Bitcoin = arrayCrypto.find(element => element["name"] === "Bitcoin");
        const BTCaddress = "```bc1qjls8jftd2j86s0w0ahegj9tysj3mktmqlt0e6c```";
        const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name : "Bitcoin",
            iconURL : Bitcoin["logo_url"]
        })
        .setDescription(`You have selected paying with **Bitcoin**.

        Please pay the following BTC amount to the following bitcoin adress:
        
        Amount: ${(44.99 / parseFloat(Bitcoin['price'])).toFixed(12)} BTC
        
        Bitcoin adress: 
        ${BTCaddress}
        
        
        **Once you have paid, please click the button below to continue.**`)

        const payed = new Discord.ButtonBuilder()
        .setCustomId('payed')
        .setLabel('I payed')
        .setStyle(Discord.ButtonStyle.Success)

        const payedRow = new Discord.ActionRowBuilder()
        .addComponents(payed)

        button.message.edit({components : [newCryptoRow]})

        await button.reply("Use the I payed button once you paid the invoice")

        button.message.channel.send({
            embeds : [embed],
            components : [payedRow]
        })

    }

    if (button.customId === 'Ethereum'){

        const emojisIDs = ["1096817306048397464","1096817290508501093","1096817346351464508"];  // here are the IDs of the emojis

        let counter = -1;

        const crypto = ["Bitcoin", "Litecoin" , "Ethereum"]

        const cryptoButtons = crypto.map((crypto) => {
            counter ++;
            return new Discord.ButtonBuilder()
            .setCustomId(crypto)
            .setLabel(crypto)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setDisabled(true)
            .setEmoji({
                id : emojisIDs[counter]
            })
        })

        const newCryptoRow = new Discord.ActionRowBuilder()
        .addComponents(cryptoButtons)

        const res = await fetch("https://cryptoast.fr/api/json/cmc-price-predict-token-list.php");
        const tableau = await res.json();
        const Ethereum = tableau.find(element => element["name"] === "Ethereum");
        const ETHaddress = "```0xBFfDD06fD8E86DFB75B6894fd1E69100f1c6BC6a```"
        const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name : "Ethereum",
            iconURL : Ethereum["logo_url"]
        })
        .setDescription(`You have selected paying with **Ethereum**.

        Please pay the following ETH amount to the following litecoin adress:
        
        Amount: ${(44.99 / parseFloat(Ethereum['price'])).toFixed(12)} ETH
        
        Ethereum adress: 
        ${ETHaddress} 
        
        
        **Once you have paid, please click the button below to continue.**`)

        const payed = new Discord.ButtonBuilder()
        .setCustomId('payed')
        .setLabel('I payed')
        .setStyle(Discord.ButtonStyle.Success)

        const payedRow = new Discord.ActionRowBuilder()
        .addComponents(payed)

        button.message.edit({components : [newCryptoRow]})

        await button.reply("Use the I payed button once you paid the invoice")

        button.message.channel.send({
            embeds : [embed],
            components : [payedRow]
        })

    }

    if (button.customId === 'Litecoin'){

        const emojisIDs = ["1096817306048397464","1096817290508501093","1096817346351464508"];  // here are the IDs of the emojis

        let counter = -1;

        const crypto = ["Bitcoin", "Litecoin" , "Ethereum"]

        const cryptoButtons = crypto.map((crypto) => {
            counter ++;
            return new Discord.ButtonBuilder()
            .setCustomId(crypto)
            .setLabel(crypto)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setDisabled(true)
            .setEmoji({
                id : emojisIDs[counter]
            })
        })

        const newCryptoRow = new Discord.ActionRowBuilder()
        .addComponents(cryptoButtons)

        const res = await fetch("https://cryptoast.fr/api/json/cmc-price-predict-token-list.php");
        const tableau = await res.json();
        const Litecoin = tableau.find(element => element["name"] === "Litecoin");
        const LTCaddress = "```ltc1qxhwzeasuka0pufc7dj8e5rec3psshn248j39fu```"
        const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name : "Litecoin",
            iconURL : Litecoin["logo_url"]
        })
        .setDescription(`You have selected paying with **Litecoin**.

        Please pay the following LTC amount to the following litecoin adress:
        
        Amount: ${(44.99 / parseFloat(Litecoin['price'])).toFixed(12)} LTC
        
        Litecoin adress: 
        ${LTCaddress}
        
        
        **Once you have paid, please click the button below to continue.**`)

        const payed = new Discord.ButtonBuilder()
        .setCustomId('payed')
        .setLabel('I payed')
        .setStyle(Discord.ButtonStyle.Success)

        const payedRow = new Discord.ActionRowBuilder()
        .addComponents(payed)

        button.message.edit({components : [newCryptoRow]})

        await button.reply("Use the I payed button once you paid the invoice")

        button.message.channel.send({
            embeds : [embed],
            components : [payedRow]
        })

    }

    if (button.customId === "PayPal"){
        const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name : "PayPal",
            iconURL : "https://play-lh.googleusercontent.com/bDCkDV64ZPT38q44KBEWgicFt2gDHdYPgCHbA3knlieeYpNqbliEqBI90Wr6Tu8YOw"
        })
        .setColor("Blue")
        .setDescription(`You have selected paying with **PayPal**.

        Please pay the following BTC amount to the following bitcoin adress:
        
        Amount: 44.9 $
        
        My PayPal address : 
        *your PayPal address*
        
        
        **Once you have paid, please click the button below to continue.**`)   // Enter your PayPal address

        const emojisIDs = ["1096808873874169876",undefined,"1096811409616142376"];
        let counter = -1;

        const paiements = ["PayPal","Crypto","Cash App"]
        const buttons = paiements.map(element => {
            counter++
            return new Discord.ButtonBuilder()
            .setCustomId(element)
            .setLabel(element)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setDisabled(true)
            .setEmoji({
                id : emojisIDs[counter]
            })
        })

        const newButtonsRow = new Discord.ActionRowBuilder()
        .addComponents(buttons)

        const payed = new Discord.ButtonBuilder()
        .setCustomId('payed')
        .setLabel('I payed')
        .setStyle(Discord.ButtonStyle.Success)

        const payedRow = new Discord.ActionRowBuilder()
        .addComponents(payed)

        button.message.edit({
            components : [newButtonsRow]
        })

        await button.reply("Use the I payed button once you paid the invoice")

        button.message.channel.send({
            embeds : [embed],
            components : [payedRow]
        })
    }

    if (button.customId === 'accept'){

        const emojisIDs = ["1096808873874169876",undefined,"1096811409616142376"];  // here are the IDs of the emojis
        let counter = -1;
        const paiements = ["PayPal","Crypto","Cash App"]
        const buttons = paiements.map(element => {
            counter ++;
            return new Discord.ButtonBuilder()
            .setCustomId(element)
            .setLabel(element)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji({id : emojisIDs[counter]})
        })

        buttons[2].setDisabled(true);

        const buttonsRow = new Discord.ActionRowBuilder()
        .addComponents(buttons)

        const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: 'Please choose a payment method, by clicking on one of the buttons below ⬇️⬇️⬇️',
            iconURL: Client.user.avatarURL()
            })
        .setColor('Blue')

        const accept = new Discord.ButtonBuilder()
        .setCustomId('accept')
        .setLabel('accept terms')
        .setStyle(Discord.ButtonStyle.Success)
        .setDisabled(true);

        const acceptRow = new Discord.ActionRowBuilder()
        .addComponents(accept);

        button.message.edit({
            components: [acceptRow]
        });

        await button.reply("thank you for accepting our terms !");
                
        button.message.channel.send({
            embeds: [embed],
            components : [buttonsRow]
        });

    }
})

Client.on("channelCreate", (channel) => {
    setTimeout(() => {
        if (channel.parent.name !== "Payment Channels") return; // replace "Voice Channels" by the name of the catory wher the channels are created

        const accept = new Discord.ButtonBuilder()
        .setCustomId('accept')
        .setLabel('accept terms')
        .setStyle(Discord.ButtonStyle.Success)
    
        const acceptRow = new Discord.ActionRowBuilder()
        .addComponents(accept)
    
        const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: 'Terms',
            iconURL: Client.user.avatarURL()
        })
        .setColor('Blue')
        .setDescription("Hey,\nthank you for choosing InfiniteCore. In this ticket you will get a step-by-step instruction on how to purchase the tool. Please read the following terms:\n\n**Please note that once you have bought the tool, you can not refund it anymore!**\n\nIf you agree with the terms above, click the button below to continue.") // place your conditions in the setDescription("...")
        
        channel.send({
            embeds: [embed],
            components : [acceptRow]
        });
    },500)
    

})
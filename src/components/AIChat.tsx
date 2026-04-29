'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Bot, X, Minimize2, Send, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface KnowledgeItem {
  keywords: string[];
  category: string;
  response: string;
}

const quickActions = [
  'How to book',
  'Cancel booking',
  'My bookings',
  'Payment issues',
  'Leave a review',
  'Contact support',
];

const knowledgeBase: KnowledgeItem[] = [
  // === BOOKING ===
  {
    category: 'booking',
    keywords: ['book', 'appointment', 'schedule', 'reserve', '预约', 'scheduling', 'making', 'create booking', 'new booking', 'how do i book', 'want to book', 'need appointment', 'book now', '如何预约', '预约', ' reserv', 'cita', 'termin'],
    response: `📅 **Booking an Appointment**

Here's how to book in just a few steps:

1. **Search** - Browse beauty services near you or search for a specific business
2. **Choose Service** - Pick the service you want (hair, nails, massage, etc.)
3. **Select Time** - Choose an available date & time slot
4. **Confirm** - Review details & confirm your booking
5. **Done!** - Get instant confirmation via email/SMS

💡 **Pro Tips:**
• Book at least 24 hours ahead for best availability
• Check business ratings (4+ stars is great)
• Look for "Available Today" or "Quick Book" tags
• Add appointments to your calendar

Need help finding something specific?`
  },
  {
    category: 'booking',
    keywords: ['search', 'find', 'looking for', 'find a', 'near me', 'nearby', 'closest', 'location', '地址', '附近', 'ubicacion', 'cerca', 'buscar', 'explore', 'discover'],
    response: `🔍 **Finding Businesses**

Here's how to find the perfect beauty service:

**Search Options:**
• Search by service type (e.g., "haircut", "manicure")
• Search by business name
• Filter by location

**Filter By:**
• 📍 Distance (1mi, 5mi, 10mi+)
• ⭐ Rating (4+ stars recommended)
• 💰 Price range
• 💅 Service category
• 🕐 Availability

**Business Profiles Show:**
• Services offered & pricing
• Operating hours
• Customer reviews
• Photos of their work
• Location & directions

What are you looking for? I can help you search!`
  },
  {
    category: 'booking',
    keywords: ['quick book', 'same day', 'today', 'urgent', 'asap', 'emergency', 'now', 'immediate', 'available today', '快速预约', '今日', '当天', 'urgente', 'ahora', 'hoy'],
    response: `⚡ **Same-Day Booking**

Need a beauty appointment right now? Here's how:

1. **Filter by "Available Today"** - Look for this tag in search results
2. **Check Tomorrow** - Some slots may be available next day
3. **Call Business Directly** - Their contact info is on their profile
4. **Join Waitlist** - Some businesses offer this for cancellations

💡 **Tips for Same-Day:**
• Book early morning for best chances
• Be flexible with time slots
• Check nearby businesses
• Some offer "Quick Book" for fast confirmation

Note: Same-day bookings may have limited options or small fees.`
  },
  {
    category: 'booking',
    keywords: ['gift', 'gift card', 'voucher', 'present', '赠送', '礼物', 'bono', 'regalo', 'cupom'],
    response: `🎁 **Gift Cards & Vouchers**

Give the gift of beauty!

**How to Buy:**
1. Go to your profile
2. Select "Gift Cards"
3. Choose amount ($25, $50, $100, custom)
4. Add a personal message
5. Send via email or text

**How to Redeem:**
• The recipient enters the code at checkout
• Can be used for any service
• No expiration date
• Partial redemption allowed

Gift cards make perfect presents for birthdays, holidays, or just because! 🎀`
  },

  // === CANCELLATION ===
  {
    category: 'cancellation',
    keywords: ['cancel', 'cancelled', 'cancellation', '取消', '取消预约', 'annull', 'cancelar', 'abbrechen', 'storno', 'no-show', 'no show', 'didnt show', 'forgot'],
    response: `❌ **Cancelling a Booking**

**To Cancel:**
1. Go to **My Bookings**
2. Find the booking you want to cancel
3. Tap **Cancel Booking**
4. Confirm cancellation

**Policy:**
• ⏰ Cancel **24+ hours** before → Full refund
• ⚠️ Cancel within 24hrs → May incur a small fee
• 🚫 No-show → No refund

**Tips:**
• Check the business's specific cancellation policy
• Some offer free cancellation up to 12hrs before
• You'll receive an email confirmation of cancellation

Need to cancel right now? I can guide you!`
  },
  {
    category: 'cancellation',
    keywords: ['reschedule', 'change time', 'different time', ' postpone', 'delay', '改期', '更改时间', 'cambiar', 'cambiar hora', 'umstellen', 'verschieben', 'reschedule'],
    response: `📆 **Rescheduling Your Booking**

**How to Reschedule:**
1. Go to **My Bookings**
2. Select your upcoming booking
3. Tap **Reschedule**
4. Choose a new available date/time
5. Confirm the change

**Important:**
• Can usually reschedule up to 24hrs before
• Some businesses may have different policies
• You'll get a new confirmation email
• If new time costs more, you'll pay the difference

**Tip:** Rescheduling is often better than cancelling if your plans just changed!`
  },

  // === PAYMENTS ===
  {
    category: 'payments',
    keywords: ['payment', 'pay', 'paying', 'paid', 'card', 'credit', 'debit', 'wallet', 'money', 'cash', '付款', '支付', 'pago', 'pagar', 'zahlung', 'bezahlen', 'precio', 'cost', 'fee'],
    response: `💳 **Payment Methods**

We accept multiple payment options:

**Accepted Methods:**
• 💳 Credit Cards (Visa, Mastercard, American Express)
• 💵 Debit Cards (with Visa/Mastercard logo)
• 📱 Digital Wallets (Apple Pay, Google Pay, Samsung Pay)
• 🏦 Bank Transfer (for select businesses)

**How It Works:**
1. Payment is processed when you confirm booking
2. Your card is charged the exact amount shown
3. You receive a receipt via email

🔒 **Security:**
• All payments are encrypted
• We never store your full card details
• PCI-DSS compliant

Have a promo code? Ask me about applying it!`
  },
  {
    category: 'payments',
    keywords: ['promo', 'promocode', 'coupon', 'discount', 'deal', 'offer', 'code', 'voucher', '优惠', '折扣', '促销', 'descuento', 'oferta', 'rabatt', 'gutschein', 'deal'],
    response: `🎟️ **Promo Codes & Discounts**

**How to Apply a Promo Code:**
1. At checkout, tap **"Add Promo Code"**
2. Enter your code
3. Tap **Apply**
4. Discount will show in your total

**Types of Deals:**
• 💫 First-time user discounts (10-20% off)
• 🎁 Bundle deals (save on multiple services)
• 🔥 Flash sales (limited time offers)
• 🌟 Loyalty rewards (earn points on bookings)
• 📱 Newsletter exclusive offers

**Where to Find Deals:**
• Check the "Offers" tab in the app
• Follow your favorite businesses
• Subscribe to our emails

Got a promo code? Tell me and I'll help you use it!`
  },
  {
    category: 'payments',
    keywords: ['refund', 'money back', 'reimbursement', '退款', '退款', 'reembolso', 'devolucion', 'rückerstattung', 'money back', 'got money back', 'return'],
    response: `💰 **Refunds**

**Refund Policy:**
• ✅ Cancelled 24+ hours before → 100% refund
• ⚠️ Cancelled within 24 hours → May incur small fee
• 🚫 No-show → No refund available
• ❌ Service not as described → Contact support immediately

**How to Request a Refund:**
1. Go to **My Bookings**
2. Select the booking
3. Tap **Request Refund**
4. Select reason and explain
5. Submit

⏱️ **Timeline:**
• We review requests within 24-48 hours
• Refunds take 5-10 business days to appear

Got a refund issue? Tell me more so I can help!`
  },
  {
    category: 'payments',
    keywords: ['receipt', 'invoice', 'bill', 'charge', 'transaction', ' receipt', '发票', '收据', 'factura', 'rechnung', 'fatura'],
    response: `🧾 **Receipts & Invoices**

**Where to Find Receipts:**
1. Go to **My Bookings**
2. Select your completed booking
3. Tap **View Receipt**

**What's Included:**
• Business name & address
• Service details
• Amount paid
• Date of transaction
• Payment method used

**Need an Invoice?**
• Some businesses offer detailed invoices
• Contact the business directly for business/invoice requests
• Check your email for digital receipt

Want me to help you find a specific receipt?`
  },

  // === REVIEWS ===
  {
    category: 'reviews',
    keywords: ['review', 'rating', 'star', 'stars', 'rate', 'rating', 'feedback', 'comment', '评价', '评论', 'resena', 'bewertung', 'aval', 'recensione'],
    response: `⭐ **Leaving a Review**

**How to Leave a Review:**
1. Complete your appointment
2. You'll receive a prompt to rate (or check My Bookings)
3. Tap the star rating (1-5)
4. Write a brief comment (optional but helpful!)
5. Submit

**What to Include:**
• Quality of the service
• Cleanliness & ambiance
• Staff friendliness
• Value for money

**Why Reviews Matter:**
• Help other clients make decisions
• Recognize great service providers
• Businesses respond to feedback

After your appointment, don't forget to rate your experience!`
  },
  {
    category: 'reviews',
    keywords: ['edit review', 'change review', 'update review', 'delete review', 'remove review', '评论', '修改评价', 'editar resena', 'bewertung ändern'],
    response: `✏️ **Editing Your Review**

**Can You Edit?**
• You can edit your review within 48 hours of posting
• After that, contact support to request changes
• Some platforms allow updating ratings only

**How to Edit:**
1. Go to **My Bookings**
2. Find the completed booking
3. Tap your existing review
4. Make your changes
5. Save

**If You Can't Edit:**
• Contact our support team
• Provide your booking ID and requested changes
• We'll help you update it!

Need to edit a review? Let me know which one!`
  },
  {
    category: 'reviews',
    keywords: ['report', 'report review', 'fake review', 'scam', 'inappropriate', 'complaint', 'reportar', 'melden', 'denunciar', 'problem with review'],
    response: `🚩 **Reporting a Review**

**How to Report:**
1. Find the review on the business page
2. Tap the "..." menu or flag icon
3. Select **Report Review**
4. Choose the reason:
   • Fake or fraudulent
   • Inappropriate content
   • Spam
   • Not about this business
5. Submit with details

**What Happens Next:**
• Our team reviews reports within 24-48 hours
• We investigate and take action if needed
• You'll be notified of the outcome

**Alternative:**
• Contact support directly with the business name and issue
• We'll investigate thoroughly

Found something suspicious? Let's report it!`
  },

  // === BOOKINGS MANAGEMENT ===
  {
    category: 'bookings',
    keywords: ['my booking', 'my bookings', 'upcoming', 'past', 'history', 'appointment', 'appointments', 'reservations', '订单', '历史', 'mis reservas', 'meine buchungen', 'minhas reservas'],
    response: `📋 **Your Bookings**

**Where to Find All Bookings:**
Go to **My Bookings** in your profile

**Booking Statuses:**
• ⏳ **Pending** - Awaiting business confirmation
• ✅ **Confirmed** - Your appointment is set!
• 🔄 **In Progress** - Service is being performed
• ✨ **Completed** - Service done, ready for review
• ❌ **Cancelled** - Booking was cancelled

**For Each Booking You Can:**
• 📝 View details (date, time, service, business)
• 📅 Reschedule to a different time
• ❌ Cancel if needed
• ⭐ Leave a review after completion
• 🧾 Download receipt

Want me to help you find a specific booking?`
  },
  {
    category: 'bookings',
    keywords: ['reminder', 'notification', 'notify', 'remind', 'alert', '提醒', '通知', 'recordatorio', 'benachrichtigung', 'lembrete', 'confirm', 'confirmation'],
    response: `🔔 **Notifications & Reminders**

**What We Notify You About:**
• ✅ Booking confirmation
• 📅 Appointment reminders (24 hours & 1 hour before)
• ✨ Appointment completed
• 📝 Review requests
• 💬 Messages from businesses
• 🎁 Special offers

**Manage Your Notifications:**
1. Go to **Account Settings**
2. Tap **Notifications**
3. Choose what to receive:
   • Push notifications
   • Email notifications
   • SMS notifications

**Tips:**
• Enable push notifications for real-time updates
• Keep your email/phone updated
• Check spam folder for emails

Want to adjust your notification settings?`
  },

  // === ACCOUNT ===
  {
    category: 'account',
    keywords: ['account', 'profile', 'settings', 'edit profile', 'update profile', '个人信息', '账户', '设置', 'perfil', 'configuracion', 'einstellungen', 'conta', 'settings'],
    response: `👤 **Account & Profile Settings**

**Update Your Profile:**
• Name, email, phone number
• Profile photo
• Preferred contact method

**Security Settings:**
• Change password
• Enable two-factor authentication
• Review login activity

**Preferences:**
• Language selection
• Notification preferences
• Default payment method
• Saved addresses

**How to Access:**
1. Go to **Account** tab
2. Tap **Settings**
3. Make your changes
4. Save

What would you like to update?`
  },
  {
    category: 'account',
    keywords: ['password', 'change password', 'forgot password', 'reset password', 'login issue', 'cant login', 'login problems', '密码', '登录', 'contraseña', 'senha', 'passwort'],
    response: `🔐 **Password & Login Help**

**Forgot Your Password?**
1. Tap **Forgot Password** on login screen
2. Enter your email
3. Check your email for reset link
4. Create a new password

**Change Your Password:**
1. Go to **Account** > **Settings**
2. Tap **Change Password**
3. Enter current password
4. Enter new password twice
5. Save

**Login Issues?**
• Check your email is correct
• Try clearing browser cache
• Use "Forgot Password" if needed
• Contact support if nothing works

**Tips:**
• Use a strong, unique password
• Enable two-factor for extra security

Having login trouble? Tell me what's happening!`
  },
  {
    category: 'account',
    keywords: ['email', 'change email', 'update email', 'phone', 'change phone', 'number', 'contact', '联系', '联系信息', 'correo', 'telefono', 'kontakt'],
    response: `📧 **Updating Contact Info**

**Change Your Email:**
1. Go to **Account** > **Settings**
2. Tap **Email** 
3. Enter new email
4. Verify via confirmation link

**Change Your Phone:**
1. Go to **Account** > **Settings**
2. Tap **Phone Number**
3. Enter new number
4. Verify via SMS code

**Why Update?**
• Get booking confirmations
• Receive appointment reminders
• Get special offers
• Security verification

**Note:** Some features require verified contact info. Keeping your details updated ensures you never miss important notifications!`
  },
  {
    category: 'account',
    keywords: ['delete account', 'remove account', 'close account', 'deactivate', 'delete my data', 'privacy', 'privacy policy', 'data', '删除账户', '隐私', 'eliminar cuenta', 'datenschutz', 'privacidade'],
    response: `🗑️ **Account Deletion & Privacy**

**Delete Your Account:**
1. Go to **Account** > **Settings**
2. Tap **Delete Account**
3. Confirm your decision
4. Account will be deactivated

**What Happens:**
• Your profile is removed
• Booking history is deleted
• You can't recover your account
• Re-registering with same email may not be allowed

**Privacy & Data:**
• We protect your personal information
• Your data is encrypted
• We never sell your info to third parties
• You can request a data export

**For Privacy Questions:**
• Check our Privacy Policy in Settings
• Contact support for data requests

Need help with account or privacy?`
  },

  // === BUSINESSES ===
  {
    category: 'businesses',
    keywords: ['business', 'salon', 'spa', 'stylist', 'beauty', 'salon', '沙龙', 'shop', 'store', 'parlour', 'barber', 'barbershop', 'salão', 'salon', 'friseur'],
    response: `🏪 **Beauty Businesses**

**Browse by Category:**
• 💇 Hair - Cuts, color, styling, treatments
• 💅 Nails - Manicure, pedicure, extensions, art
• ✨ Skin - Facials, threading, waxing, peels
• 💆 Massage - Swedish, deep tissue, hot stone
• 💄 Makeup - Event, bridal, natural, special FX
• 👁️ Brows - Lamination, shaping, microblading

**What Business Profiles Show:**
• Services & pricing
• Operating hours
• Customer ratings & reviews
• Photos of work
• Location & directions
• Contact information
• Special offers

**How to Choose:**
• Check ratings (4+ stars is good)
• Read recent reviews
• Compare prices
• Check availability

Looking for a specific type of business?`
  },
  {
    category: 'businesses',
    keywords: ['hours', 'open', 'closing', 'time', 'schedule', '营业时间', '开放时间', 'horario', 'öffnungszeiten', 'horário', 'when open'],
    response: `🕐 **Business Hours**

**How to Check Hours:**
1. Search for a business
2. Check their profile page
3. Look for "Hours" section

**What You'll See:**
• Monday - Friday hours
• Saturday & Sunday hours
• Holiday hours
• Current status (Open/Closed)

**Tips:**
• Some businesses have varying hours by service
• Book last minute? Call to confirm they're open
• Holiday hours may differ - check ahead

**Current Status:**
Look for green "Open Now" or red "Closed" badges on business listings!

Need help finding a business that's open now?`
  },
  {
    category: 'businesses',
    keywords: ['distance', 'location', 'map', 'address', 'directions', '导航', '地址', 'direccion', 'directions', 'ubicacion', 'ubicação'],
    response: `📍 **Location & Directions**

**Find Businesses Near You:**
1. Enable location services
2. Search for services or businesses
3. Results show distance from you
4. Filter by distance (1mi, 5mi, 10mi+)

**Business Address Includes:**
• Full street address
• City & zip code
• Parking info
• Accessibility notes

**Getting Directions:**
• Tap "Get Directions" to open your maps app
• Shows walking/driving time
• Traffic-aware arrival estimates

**Tips:**
• Check if they validate parking
• Look for nearby public transit
• Some offer pickup/delivery

Want me to help you find something nearby?`
  },

  // === SERVICES ===
  {
    category: 'services',
    keywords: ['service', 'services', 'what do they offer', 'treatments', 'offering', 'services list', '服务', '项目', 'servicios', 'leistungen', 'serviços'],
    response: `💅 **Services Offered**

**Common Services by Category:**

**Hair:**
• Haircut & styling
• Hair coloring & highlights
• Hair treatment & conditioning
• Braids & updos

**Nails:**
• Classic manicure
• Gel/Shellac nails
• Acrylic nails
• Nail art & designs

**Skin:**
• Facial treatments
• Threading
• Waxing
• Microdermabrasion

**Massage:**
• Swedish massage
• Deep tissue
• Hot stone therapy
• Aromatherapy

**Makeup:**
• Everyday makeup
• Event/Party makeup
• Bridal makeup

**Prices & Availability:**
• Vary by business
• Check individual business profiles
• Some require consultation

Looking for a specific service?`
  },
  {
    category: 'services',
    keywords: ['duration', 'how long', 'time', 'takes', 'hours', 'minutes', '时长', '时间', 'cuánto tiempo', 'dauer', 'quanto tempo'],
    response: `⏱️ **Service Duration**

**Typical Service Times:**

**Hair:**
• Cut & style: 45-60 min
• Color: 1.5-3 hours
• Treatment: 30-60 min

**Nails:**
• Classic manicure: 30 min
• Gel manicure: 45 min
• Full set (acrylic): 60-90 min

**Skin:**
• Facial: 45-60 min
• Threading: 15-30 min
• Waxing: 30-60 min

**Massage:**
• Swedish: 60-90 min
• Deep tissue: 60-90 min
• Hot stone: 60-90 min

**Note:** Times are estimates. Ask the business when booking for exact duration. Consider this when scheduling same-day appointments!`
  },
  {
    category: 'services',
    keywords: ['consultation', 'consult', 'talk', 'ask', 'question', 'inquiry', '咨询', '询问', 'consulta', 'beratung', 'consulta'],
    response: `💬 **Consultations**

**When You Might Need a Consultation:**
• Complex hair coloring
• Extensive nail work
• First-time treatments
• Custom pricing needed
• Special requests

**How It Works:**
1. Book a "Consultation" slot (usually free)
2. Discuss your needs with the professional
3. Get a quote and time estimate
4. Book your actual appointment

**Tips:**
• Bring reference photos
• Be clear about what you want
• Ask about products used
• Discuss maintenance needs

**Direct Contact:**
• Message businesses through their profile
• Call them directly
• Some have online booking for consultations

Want help scheduling a consultation?`
  },

  // === APP FEATURES ===
  {
    category: 'app',
    keywords: ['app', 'application', 'how to use', 'use', 'how does', 'feature', 'features', 'functions', '功能', 'how to', 'como usar', 'wie funktioniert', 'como usar'],
    response: `📱 **App Features**

**Main Features:**

**🔍 Search & Discovery**
• Find businesses by location, service, name
• Filter by rating, price, availability

**📅 Booking**
• Book appointments 24/7
• Instant confirmation
• Manage all bookings in one place

**⭐ Reviews & Ratings**
• Read reviews from real clients
• Leave your own reviews
• Rate your experiences

**💳 Payments**
• Secure in-app payments
• Save payment methods
• Apply promo codes

**🔔 Notifications**
• Booking reminders
• Special offers
• Review requests

**💬 Communication**
• Chat with businesses
• Get support 24/7 (that's me!)

**Navigation:**
• Bottom tabs: Home, Search, Bookings, Account

Need help with a specific feature?`
  },
  {
    category: 'app',
    keywords: ['update', 'update app', 'new version', 'upgrade', 'download', 'install', '更新', '升级', 'actualizar', 'aktualisieren', 'atualizar'],
    response: `📲 **App Updates**

**Why Update?**
• New features & improvements
• Bug fixes & performance
• Better security
• New services

**How to Update:**
1. Open **App Store** (iOS) or **Play Store** (Android)
2. Search for **LastMinute**
3. Tap **Update** if available
4. Wait for download & install

**Tips:**
• Update on WiFi to save data
• Restart app after update
• Check for updates regularly

**Having Update Issues?**
• Check your storage space
• Ensure you have good internet
• Try clearing app cache
• Reinstall if needed

What's happening with your app?`
  },
  {
    category: 'app',
    keywords: ['crash', 'not working', 'error', 'bug', 'freeze', 'stuck', 'slow', 'loading', '问题', '错误', 'no funciona', 'error', 'problema'],
    response: `🐛 **Troubleshooting**

**Common Issues & Solutions:**

**App Not Working:**
1. Close & reopen the app
2. Check your internet connection
3. Update the app to latest version
4. Clear app cache
5. Reinstall the app

**Slow Performance:**
• Check your internet speed
• Close other apps
• Update your phone's software

**Payment Issues:**
• Verify your card details
• Check card has funds
• Try different payment method

**Booking Problems:**
• Check business is open
• Verify your details are correct
• Try different time slot

Still having issues? Contact support with details!`
  },

  // === SUPPORT ===
  {
    category: 'support',
    keywords: ['support', 'help', 'contact', 'customer service', 'service', 'assist', 'talk to', 'speak', 'call', '客服', '帮助', '联系', 'soporte', 'hilfe', 'atendimento'],
    response: `📞 **Contact Support**

**How to Reach Us:**

💬 **Live Chat** (24/7) - Chat with me anytime! I'm here to help!

📧 **Email** - support@lastminute.com
Response time: 24 hours

📱 **Phone** - 1-800-LASTMIN
Mon-Fri: 9am-6pm EST
Sat: 10am-4pm EST

💬 **In-App Chat** - Available 24/7

**For Faster Help:**
• Have your booking ID ready
• Describe the issue clearly
• Attach screenshots if relevant
• Mention what you already tried

**What We Help With:**
• Booking issues & modifications
• Payment & refund inquiries
• Account assistance
• Technical problems
• Business complaints

How can I assist you today?`
  },
  {
    category: 'support',
    keywords: ['issue', 'problem', 'wrong', 'something wrong', 'bad', 'terrible', 'worst', 'angry', 'frustrated', 'issue', 'problema', 'problème', 'problema'],
    response: `😟 **I'm Sorry You're Having Issues**

Let me help you resolve this!

**Common Issues We Can Fix:**
• Incorrect bookings
• Payment problems
• Service not as described
• Business not meeting expectations
• Technical difficulties
• Account problems

**What I'd Need From You:**
1. What happened? (Be specific)
2. When did it happen?
3. Any error messages?
4. Your booking ID (if applicable)
5. What would you like us to do?

**Next Steps:**
• I'll do my best to help immediately
• May need to connect you with support team
• We'll keep you updated

Tell me what happened and let's fix it!`
  },

  // === USER TYPES ===
  {
    category: 'business_owner',
    keywords: ['business owner', 'business owner', 'manage business', 'add service', 'my business', 'dashboard', 'earnings', 'revenue', 'salon owner', '店铺', '商家', 'negocio', 'empresa', 'geschäft'],
    response: `🏢 **Business Owner Dashboard**

**Managing Your Business:**

**Profile:**
• Update business info, hours, photos
• Respond to reviews
• Manage your team

**Services:**
• Add/edit services & pricing
• Set duration for each service
• Create packages & deals

**Bookings:**
• View upcoming appointments
• Accept/reject bookings
• Manage your schedule

**Analytics:**
• Track bookings & revenue
• See popular services
• Monitor reviews

**Payments:**
• View earnings
• Manage payouts
• Track transactions

**Need Help?**
• Check our Business Help Center
• Contact business support

Want help with a specific business feature?`
  },
  {
    category: 'admin',
    keywords: ['admin', 'administrator', 'manage users', 'manage businesses', 'approve', 'reject', 'reports', 'analytics', 'dashboard', '管理', 'administrador', 'admin'],
    response: `🎛️ **Admin Features**

**Admin Dashboard Options:**

**User Management:**
• View all users
• Suspend/activate accounts
• Reset passwords

**Business Management:**
• Approve new businesses
• Reject/remove listings
• Verify business details

**Content Moderation:**
• Review reported content
• Manage reviews
• Handle disputes

**Reports & Analytics:**
• Booking statistics
• Revenue reports
• User activity
• Business performance

**System Settings:**
• Configure app settings
• Manage categories
• Set commission rates

Are you an admin looking for something specific?`
  },

  // === MISC ===
  {
    category: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'start', 'begin', '你好', '嗨', 'hola', 'oi', 'hallo', 'guten tag', 'welcome', 'start'],
    response: `👋 **Welcome to LastMinute Assistant!** ✨

I'm here to help you with anything about our app!

**I can assist you with:**

📅 **Bookings** - How to book, modify, cancel
💳 **Payments** - Methods, refunds, promo codes
⭐ **Reviews** - Rating, editing, reporting
👤 **Account** - Profile, settings, passwords
🏪 **Businesses** - Finding, viewing, contacting
📋 **Your Bookings** - Managing appointments
💰 **Deals** - Discounts, offers, loyalty
🔧 **Troubleshooting** - App issues, errors
📞 **Support** - Contacting our team

**Quick Start:**
Click a quick action below or just type your question!

What would you like to know?`
  },
  {
    category: 'thanks',
    keywords: ['thank', 'thanks', 'helpful', 'great', 'good', 'awesome', 'amazing', 'perfect', 'nice', '谢谢', '感谢', 'gracias', 'danke', 'obrigado', 'you helped'],
    response: `😊 **You're Welcome!**

Happy to help! If you have any more questions, don't hesitate to ask.

I'm here 24/7 for:
• Quick answers
• Booking help
• Troubleshooting
• General questions

Have a great day and enjoy your LastMinute experience! 🌟

Is there anything else I can help you with?`
  },
  {
    category: 'goodbye',
    keywords: ['bye', 'goodbye', 'see you', 'later', 'thanks bye', 'gotta go', '再见', '拜拜', 'adeus', 'tchau', 'auf wiedersehen', 'good night'],
    response: `👋 **Goodbye!**

Thanks for chatting with me!

**Remember:**
• Book your beauty appointments easily
• 24/7 support is always available
• Check out special deals & offers

Take care and see you soon! ✨

Need help with anything else before you go?`
  },
  {
    category: 'default',
    keywords: ['what', 'how', 'why', 'when', 'where', 'who', 'can i', 'is it', 'does', 'should', 'could', 'would', 'tell me', 'explain', '什么', '如何', '为什么', 'cuando', 'donde', 'por qué', 'wie', 'warum', 'wo'],
    response: `🤔 **I want to help!**

I understand you have a question, but I want to make sure I give you the right answer.

**I can help you with:**

📅 **Booking** - How to schedule, modify, or cancel appointments
💳 **Payments** - Payment methods, refunds, promo codes
⭐ **Reviews** - Leaving, editing, or reporting reviews
👤 **Account** - Profile, settings, passwords, login issues
🏪 **Businesses** - Finding, viewing details, contacting
📋 **Your Bookings** - Managing all your appointments
💰 **Deals & Offers** - Discounts, promo codes, loyalty points
🔧 **Troubleshooting** - App issues, errors, technical help
📞 **Support** - Contacting our support team
💆 **Services** - Types of services, pricing, duration
🏢 **For Businesses** - Dashboard, managing bookings, analytics
🎛️ **For Admins** - User management, business approval

**Try:**
• Rephrasing your question
• Using fewer words
• Picking a category from above

What specific topic can I help you with?`
  },
];

const colors = {
  primary: '#fdfcd2',
  secondary: '#140755',
  accent: '#ff6b9d',
  accent2: '#00d4ff',
  surface: '#12122a',
  surfaceLight: '#1a1a3a',
  background: '#0a0a1a',
  textPrimary: '#fdfcd2',
  textSecondary: '#b8b8d0',
  textMuted: '#6a6a8a',
  border: '#2a2a4a',
};

function matchScore(input: string, keywords: string[]): number {
  const lowerInput = input.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerInput.includes(lowerKeyword)) {
      score += 10;
      if (lowerInput === lowerKeyword) score += 5;
      if (lowerInput.startsWith(lowerKeyword)) score += 3;
      if (lowerInput.endsWith(lowerKeyword)) score += 2;
    }
    
    const words = lowerInput.split(/\s+/);
    for (const word of words) {
      if (word.length > 3 && (lowerKeyword.includes(word) || word.includes(lowerKeyword))) {
        score += 4;
      }
    }
  }

  return score;
}

function generateResponse(userInput: string): string {
  if (!userInput.trim()) {
    return "Please type a question and I'll do my best to help!";
  }

  const input = userInput.toLowerCase();
  
  let bestMatch: { item: KnowledgeItem; score: number } | null = null;

  for (const item of knowledgeBase) {
    const score = matchScore(input, item.keywords);
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { item, score };
    }
  }

  if (bestMatch && bestMatch.score >= 4) {
    return bestMatch.item.response;
  }

  const defaultResponse = `🤔 **I want to help!**

I understand you're asking about "${userInput}" but I want to make sure I give you the right answer.

**I can help you with:**

📅 **Booking** - Schedule, modify, cancel appointments
💳 **Payments** - Methods, refunds, promo codes  
⭐ **Reviews** - Rating, editing, reporting
👤 **Account** - Profile, settings, passwords
🏪 **Businesses** - Finding & viewing details
📋 **Your Bookings** - Managing appointments
💰 **Deals** - Discounts & offers
🔧 **Troubleshooting** - App issues
📞 **Support** - Contact our team

**Try:**
• Rephrasing your question
• Being more specific
• Using keywords like "booking", "payment", "review"

What topic can I help you with?`;

  return defaultResponse;
}

export default function AIChat() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateResponse(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 400 + Math.random() * 400);
  };

  const handleQuickAction = (action: string) => {
    const actionMap: Record<string, string> = {
      'How to book': 'How do I book an appointment?',
      'Cancel booking': 'How do I cancel or reschedule my booking?',
      'My bookings': 'How do I view all my bookings?',
      'Payment issues': 'What if I have a payment problem?',
      'Leave a review': 'How do I leave a review?',
      'Contact support': 'How can I contact customer support?',
    };
    sendMessage(actionMap[action] || action);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `👋 **Hi! I'm your LastMinute Assistant** ✨

I can help you with almost anything about our app!

**What I can help with:**
📅 Booking appointments
❌ Cancellations & rescheduling  
💳 Payments & refunds
⭐ Reviews & ratings
👤 Account & settings
🏪 Finding businesses
📋 Your bookings
💰 Deals & offers
🔧 App troubleshooting
📞 Contact support

**How can I help you today?**

Tap a quick option or just type your question!`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [chatOpen]);

  return (
    <>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: minimized ? 80 : 20,
              right: 20,
              width: minimized ? 60 : 380,
              height: minimized ? 60 : 'calc(100vh - 180px)',
              maxHeight: minimized ? 60 : 580,
              background: colors.surface,
              borderRadius: minimized ? 30 : 20,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              zIndex: 9999,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {minimized ? (
              <button
                onClick={() => setMinimized(false)}
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)',
                  border: 'none',
                  borderRadius: 30,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(253, 252, 210, 0.4)',
                }}
              >
                <Bot size={28} stroke="#140755" />
              </button>
            ) : (
              <>
                <div style={{
                  background: 'linear-gradient(135deg, #140755 0%, #2a1a8a 100%)',
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(253, 252, 210, 0.3)',
                    }}>
                      <Bot size={22} stroke="#140755" />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: colors.primary }}>
                        LastMinute Assistant
                      </div>
                      <div style={{ fontSize: 12, color: colors.textMuted }}>
                        Your AI Helper
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setMinimized(true)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Minimize2 size={18} stroke={colors.textMuted} />
                    </button>
                    <button
                      onClick={() => setChatOpen(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 8,
                        borderRadius: 8,
                      }}
                    >
                      <X size={18} stroke={colors.textMuted} />
                    </button>
                  </div>
                </div>

                <div style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        background: msg.role === 'assistant' 
                          ? 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)' 
                          : 'linear-gradient(135deg, #00d4ff 0%, #4de5ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {msg.role === 'assistant' ? (
                          <Bot size={14} stroke="white" />
                        ) : (
                          <User size={14} stroke="white" />
                        )}
                      </div>
                      <div style={{
                        background: msg.role === 'assistant' ? colors.background : colors.surfaceLight,
                        padding: 12,
                        borderRadius: 16,
                        borderTopLeftRadius: msg.role === 'user' ? 16 : 4,
                        flex: 1,
                        fontSize: 14,
                        color: colors.textSecondary,
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                      }}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Bot size={14} stroke="white" />
                      </div>
                      <div style={{
                        background: colors.background,
                        padding: 12,
                        borderRadius: 16,
                        display: 'flex',
                        gap: 4,
                      }}>
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              background: colors.textMuted,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div style={{
                  display: 'flex',
                  gap: 8,
                  padding: 12,
                  borderTop: `1px solid ${colors.border}`,
                  flexWrap: 'wrap',
                }}>
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      style={{
                        padding: '8px 14px',
                        background: 'linear-gradient(135deg, rgba(253, 252, 210, 0.15) 0%, rgba(253, 252, 210, 0.05) 100%)',
                        border: '1px solid rgba(253, 252, 210, 0.3)',
                        borderRadius: 20,
                        color: colors.primary,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>

                <div style={{
                  padding: 12,
                  borderTop: `1px solid ${colors.border}`,
                  display: 'flex',
                  gap: 10,
                }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                    placeholder="Ask me anything..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 24,
                      color: colors.textPrimary,
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => sendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      background: inputValue.trim() 
                        ? 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)' 
                        : colors.surfaceLight,
                      border: 'none',
                      cursor: inputValue.trim() ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: inputValue.trim() ? '0 4px 15px rgba(255, 107, 157, 0.4)' : 'none',
                    }}
                  >
                    <Send size={18} stroke={inputValue.trim() ? 'white' : colors.textMuted} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!chatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 30,
            background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 25px rgba(253, 252, 210, 0.5)',
            zIndex: 9998,
          }}
        >
          <Bot size={28} stroke="#140755" />
        </motion.button>
      )}
    </>
  );
}
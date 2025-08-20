import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AladinBook {
  isbn13: string;
  itemId: number;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  cover: string;
  categoryId: number;
  categoryName: string;
  priceStandard: number;
  priceSales: number;
  customerReviewRank: number;
  link: string;
  description: string;
}

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Daily book sync started...')

    // Supabase 클라이언트 생성 (서비스 롤 키 사용)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const aladinApiKey = Deno.env.get('ALADIN_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 주요 장르 카테고리
    const genres = [
      { name: '소설', categoryId: 1 },
      { name: '시/에세이', categoryId: 2 },
      { name: '경제경영', categoryId: 170 },
      { name: '자기계발', categoryId: 336 },
      { name: '인문학', categoryId: 656 },
      { name: '역사', categoryId: 74 },
      { name: '과학', categoryId: 987 },
      { name: 'IT', categoryId: 351 },
    ]

    const listTypes = ['Bestseller', 'ItemNewAll']
    let totalSaved = 0
    let totalFailed = 0

    // 각 장르별 수집
    for (const genre of genres) {
      console.log(`📚 Processing ${genre.name}...`)
      
      for (const listType of listTypes) {
        try {
          // 알라딘 API 호출
          const aladinUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${aladinApiKey}&QueryType=${listType}&MaxResults=30&start=1&SearchTarget=Book&output=js&Version=20131101&CategoryId=${genre.categoryId}`
          
          const response = await fetch(aladinUrl)
          const data = await response.json()
          
          if (!data.item || data.item.length === 0) {
            console.log(`⚠️ No data for ${genre.name} - ${listType}`)
            continue
          }

          // 데이터 변환 및 저장
          for (const aladinBook of data.item) {
            if (!aladinBook.isbn13) continue

            try {
              // 기존 책 확인
              const { data: existing } = await supabase
                .from('book_external')
                .select('isbn13')
                .eq('isbn13', aladinBook.isbn13)
                .single()

              if (existing) continue // 이미 존재하면 스킵

              // 새 책 저장
              const bookData = {
                isbn13: aladinBook.isbn13,
                item_id: aladinBook.itemId,
                title: aladinBook.title,
                author: aladinBook.author,
                publisher: aladinBook.publisher,
                pub_date: aladinBook.pubDate,
                cover_url: aladinBook.cover,
                category_id: aladinBook.categoryId > 32767 ? null : aladinBook.categoryId,
                category_name: aladinBook.categoryName,
                price_standard: aladinBook.priceStandard > 32767 ? null : aladinBook.priceStandard,
                price_sales: aladinBook.priceSales > 32767 ? null : aladinBook.priceSales,
                customer_review_rank: aladinBook.customerReviewRank,
                aladin_link: aladinBook.link,
                summary: aladinBook.description,
                raw: JSON.stringify(aladinBook),
                fetched_at: new Date().toISOString()
              }

              const { error } = await supabase
                .from('book_external')
                .insert(bookData)

              if (error) {
                console.error(`❌ Save failed: ${aladinBook.title}`, error.message)
                totalFailed++
              } else {
                console.log(`✅ Saved: ${aladinBook.title}`)
                totalSaved++
              }

            } catch (err) {
              console.error(`❌ Process failed: ${aladinBook.title}`, err)
              totalFailed++
            }
          }

          // API 호출 간격
          await new Promise(resolve => setTimeout(resolve, 1000))

        } catch (err) {
          console.error(`❌ API call failed for ${genre.name} - ${listType}:`, err)
        }
      }
    }

    // 현재 총 도서 수 확인
    const { count } = await supabase
      .from('book_external')
      .select('*', { count: 'exact', head: true })

    const result = {
      success: true,
      message: `Daily sync completed! Saved: ${totalSaved}, Failed: ${totalFailed}`,
      totalBooks: count,
      savedCount: totalSaved,
      failedCount: totalFailed,
      timestamp: new Date().toISOString()
    }

    console.log('🎉 Daily book sync completed:', result)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Daily sync error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

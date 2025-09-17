{/* Key Features Section */}
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">🌟 Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
              onClick={() => navigate("/pesticide-verification")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                    <div className="text-2xl">🧪</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Smart Pesticide Verification
                    </h3>
                    <p className="text-sm text-muted-foreground">Scan products for lab-tested reports & safety details</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
              onClick={() => navigate("/byproduct-utilization")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
                    <div className="text-2xl">🌱</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      By-product Utilization
                    </h3>
                    <p className="text-sm text-muted-foreground">Monetize agricultural waste through industry connections</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
              onClick={() => navigate("/blockchain-traceability")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
                    <div className="text-2xl">📦</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Blockchain Traceability
                    </h3>
                    <p className="text-sm text-muted-foreground">QR codes for transparent crop tracking & pricing</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
              onClick={() => navigate("/farmer-support")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white">
                    <div className="text-2xl">👨‍🌾</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Farmer Support Tools
                    </h3>
                    <p className="text-sm text-muted-foreground">AI chatbot, disease prediction & expert advisory</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>